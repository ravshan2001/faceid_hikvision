<template>
  <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <CalendarIcon class="w-4 h-4 inline mr-1" />
          Boshlanish
        </label>
        <input
          v-model="localStartDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <CalendarIcon class="w-4 h-4 inline mr-1" />
          Tugash
        </label>
        <input
          v-model="localEndDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <BuildingOfficeIcon class="w-4 h-4 inline mr-1" />
          Bo'lim
        </label>
        <select
          v-model="localDepartment"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Barchasi</option>
          <option v-for="dept in departments" :key="dept._id" :value="dept._id">
            {{ dept.name }}
          </option>
        </select>
      </div>

      <div class="flex items-end gap-2">
        <button
          @click="applyFilter"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <MagnifyingGlassIcon class="w-4 h-4 inline mr-1" />
          Qidirish
        </button>
        <button
          @click="resetFilter"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowPathIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { CalendarIcon, BuildingOfficeIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  startDate: String,
  endDate: String,
  department: String,
  departments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['filter-change'])

const localStartDate = ref(props.startDate || new Date().toISOString().split('T')[0])
const localEndDate = ref(props.endDate || new Date().toISOString().split('T')[0])
const localDepartment = ref(props.department || '')

watch(
  () => props.startDate,
  (val) => (localStartDate.value = val)
)
watch(
  () => props.endDate,
  (val) => (localEndDate.value = val)
)
watch(
  () => props.department,
  (val) => (localDepartment.value = val)
)

const applyFilter = () => {
  emit('filter-change', {
    startDate: localStartDate.value,
    endDate: localEndDate.value,
    department: localDepartment.value,
  })
}

const resetFilter = () => {
  const today = new Date().toISOString().split('T')[0]
  localStartDate.value = today
  localEndDate.value = today
  localDepartment.value = ''
  applyFilter()
}
</script>
