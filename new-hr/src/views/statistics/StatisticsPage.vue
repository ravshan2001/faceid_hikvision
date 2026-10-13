<template>
  <div class="h-full overflow-y-auto bg-gray-50">
    <div class="max-w-7xl mx-auto p-4 sm:p-6">
      <!-- Page Header -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon class="w-6 sm:w-8 h-6 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
            VAKSINA HR
          </h1>
          <p class="text-sm sm:text-base text-gray-600 mt-1">{{ formatDate(new Date()) }}</p>
        </div>
        <button
          @click="refreshData"
          :disabled="loading"
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
        >
          <ArrowPathIcon :class="['w-4 h-4 sm:w-5 sm:h-5 inline mr-2', { 'animate-spin': loading }]" />
          Yangilash
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !store.dashboardData" class="flex items-center justify-center h-96">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircleIcon class="w-16 h-16 text-red-500 mx-auto mb-3" />
        <p class="text-red-800 mb-4">{{ error }}</p>
        <button @click="refreshData" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Qayta urinish
        </button>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Statistics Cards (2x2) -->
        <StatisticsCards v-if="store.dashboardData" :summary="store.dashboardData.summary" />

        <!-- Charts Row (Yonma-yon) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <WeeklyTrendChart 
            v-if="store.dashboardData" 
            :data="trendData"
            :currentPeriod="trendPeriod"
            @change-period="changeTrendPeriod"
          />
          <DepartmentChart v-if="store.dashboardData" :data="store.dashboardData.byDepartment" />
        </div>

        <!-- Tables Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <LateArrivalsTable v-if="store.dashboardData" :lateArrivals="store.dashboardData.lateArrivals" />
          <TopPerformersList
            :performers="store.topPerformers"
            :currentPeriod="performersPeriod"
            @change-period="changePerformersPeriod"
          />
        </div>

        <!-- Absent Employees Section -->
        <div class="mt-8">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <UserMinusIcon class="w-5 sm:w-6 h-5 sm:h-6 mr-2 text-red-600" />
            Kelmagan Xodimlar
          </h2>

          <DateRangeFilter
            :startDate="absentFilter.startDate"
            :endDate="absentFilter.endDate"
            :department="absentFilter.department"
            :departments="departments"
            @filter-change="handleAbsentFilter"
          />

          <div v-if="loadingAbsent" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
            </div>
          </div>

          <div v-else-if="absentData">
            <div class="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900">
                  Natijalar: <span class="text-red-600">{{ absentData.total }}</span> xodim
                </h3>
                <p class="text-xs sm:text-sm text-gray-600">
                  {{ formatDateShort(absentData.period.startDate) }} - {{ formatDateShort(absentData.period.endDate) }}
                  ({{ absentData.period.totalDays }} kun)
                </p>
              </div>
            </div>

            <div v-if="absentData.employees.length === 0" class="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
              <CheckCircleIcon class="w-16 sm:w-20 h-16 sm:h-20 text-green-500 mx-auto mb-4" />
              <p class="text-lg sm:text-xl text-gray-600">Tanlangan davrda hech kim kelmagan!</p>
            </div>

            <!-- Kelmagan xodimlar - 2 USTUN -->
            <div v-else class="grid grid-cols-2 gap-4">
              <div
                v-for="employee in absentData.employees"
                :key="employee._id"
                class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {{ getInitials(employee.fullName) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-sm truncate">{{ employee.fullName }}</h4>
                    <p class="text-xs text-gray-500">№{{ employee.employeeNo }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ employee.department }}</p>
                  </div>
                </div>

                <div class="space-y-1 border-t pt-2">
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-600">Yo'q kunlar:</span>
                    <span class="font-semibold text-red-600">{{ employee.absentDays }}</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-600">Kelgan:</span>
                    <span class="font-semibold text-gray-900">{{ employee.presentDays }}</span>
                  </div>
                  <div class="mt-2">
                    <div class="bg-gray-200 rounded-full h-1.5">
                      <div
                        :class="['h-1.5 rounded-full', getAbsentClass(employee.absentPercentage)]"
                        :style="{ width: employee.absentPercentage + '%' }"
                      ></div>
                    </div>
                    <p class="text-xs text-right text-gray-600 mt-1">{{ employee.absentPercentage }}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStatisticsStore } from '@/stores/data/statistics'
import { api } from '@/helpers/api'

import StatisticsCards from '@/components/statistics/StatisticsCards.vue'
import WeeklyTrendChart from '@/components/statistics/WeeklyTrendChart.vue'
import DepartmentChart from '@/components/statistics/DepartmentChart.vue'
import LateArrivalsTable from '@/components/statistics/LateArrivalsTable.vue'
import TopPerformersList from '@/components/statistics/TopPerformersList.vue'
import DateRangeFilter from '@/components/statistics/DateRangeFilter.vue'

import {
  ChartBarIcon,
  ArrowPathIcon,
  XCircleIcon,
  UserMinusIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'

const store = useStatisticsStore()

const loading = ref(false)
const loadingAbsent = ref(false)
const error = ref(null)
const absentData = ref(null)
const departments = ref([])
const performersPeriod = ref('month')
const trendPeriod = ref('week')
const trendData = ref([])

const absentFilter = ref({
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  department: '',
})

const loadDashboard = async () => {
  loading.value = true
  error.value = null
  try {
    await store.fetchDashboard()
    trendData.value = store.dashboardData?.weeklyTrend || []
  } catch (err) {
    error.value = 'Ma\'lumotlarni yuklashda xatolik'
  } finally {
    loading.value = false
  }
}

const loadTrendData = async (period) => {
  try {
    const response = await api.get('/statistics/trend', { params: { period } })
    if (response.data.success) {
      trendData.value = response.data.data
    }
  } catch (err) {
    console.error('Trend data error:', err)
    trendData.value = store.dashboardData?.weeklyTrend || []
  }
}

const loadTopPerformers = async (period = 'month') => {
  try {
    await store.fetchTopPerformers({ period, limit: 10 })
  } catch (err) {
    console.error('Top performers error:', err)
  }
}

const loadAbsentEmployees = async () => {
  loadingAbsent.value = true
  try {
    const response = await api.get('/statistics/absent-employees', { params: absentFilter.value })
    if (response.data.success) {
      absentData.value = response.data.data
    }
  } catch (err) {
    console.error('Absent employees error:', err)
  } finally {
    loadingAbsent.value = false
  }
}

const loadDepartments = async () => {
  try {
    const response = await api.get('/data/department')
    if (response.data.success) {
      departments.value = response.data.data || []
    }
  } catch (err) {
    console.error('Departments error:', err)
    departments.value = []
  }
}

const changeTrendPeriod = (period) => {
  trendPeriod.value = period
  loadTrendData(period)
}

const changePerformersPeriod = (period) => {
  performersPeriod.value = period
  loadTopPerformers(period)
}

const handleAbsentFilter = (filter) => {
  absentFilter.value = { ...filter }
  loadAbsentEmployees()
}

const refreshData = () => {
  loadDashboard()
  loadTopPerformers(performersPeriod.value)
  loadAbsentEmployees()
}

const formatDate = (date) => {
  return date.toLocaleDateString('uz-UZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDateShort = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : name[0]
}

const getAbsentClass = (percentage) => {
  const percent = parseFloat(percentage)
  if (percent >= 50) return 'bg-red-600'
  if (percent >= 30) return 'bg-orange-500'
  return 'bg-yellow-500'
}

onMounted(() => {
  loadDashboard()
  loadTopPerformers()
  loadDepartments()
  loadAbsentEmployees()
})
</script>
