<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center mb-3">
        <StarIcon class="w-5 h-5 mr-2 text-yellow-500" />
        Top Xodimlar
      </h3>
      <div class="flex gap-2">
        <button
          v-for="p in periods"
          :key="p.value"
          @click="$emit('change-period', p.value)"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            p.value === currentPeriod
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <div v-if="performers.length === 0" class="text-center py-12">
      <UsersIcon class="w-16 h-16 mx-auto text-gray-400 mb-3" />
      <p class="text-gray-600">Ma'lumot topilmadi</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(performer, index) in performers"
        :key="performer._id"
        class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div
          :class="[
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
            getRankClass(index),
          ]"
        >
          <span v-if="index < 3">🏅</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="ml-3 flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ performer.fullName }}</p>
          <p class="text-xs text-gray-500">№{{ performer.employeeNo }}</p>
        </div>
        <div class="ml-3 text-right">
          <p class="text-xs text-gray-500">{{ performer.attendanceDays }}/{{ performer.totalDays }}</p>
          <div class="mt-1 w-24 bg-gray-200 rounded-full h-2">
            <div
              :class="['h-2 rounded-full transition-all', getProgressClass(performer.percentage)]"
              :style="{ width: performer.percentage + '%' }"
            ></div>
          </div>
          <p class="text-xs font-semibold text-gray-900 mt-1">{{ performer.percentage }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarIcon, UsersIcon } from '@heroicons/vue/24/outline'

defineProps({
  performers: {
    type: Array,
    default: () => [],
  },
  currentPeriod: {
    type: String,
    default: 'month',
  },
})

defineEmits(['change-period'])

const periods = [
  { value: 'week', label: 'Hafta' },
  { value: 'month', label: 'Oy' },
  { value: 'year', label: 'Yil' },
]

const getRankClass = (index) => {
  if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
  if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
  if (index === 2) return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
  return 'bg-gray-200 text-gray-700'
}

const getProgressClass = (percentage) => {
  if (percentage >= 95) return 'bg-green-500'
  if (percentage >= 85) return 'bg-blue-500'
  if (percentage >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
}
</script>
