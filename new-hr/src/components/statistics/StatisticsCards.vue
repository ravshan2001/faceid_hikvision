<template>
  <div>
    <!-- 1-QATOR: Total va Ishda -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <UsersIcon class="w-6 h-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Jami Xodimlar</p>
            <p class="text-2xl font-bold">{{ summary.total || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Ishda</p>
            <p class="text-2xl font-bold">{{ summary.present || 0 }}</p>
            <span class="text-xs text-green-600">{{ summary.attendanceRate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2-QATOR: Yo'q va Kechikkanlar -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
            <XCircleIcon class="w-6 h-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Yo'q</p>
            <p class="text-2xl font-bold">{{ summary.absent || 0 }}</p>
            <span class="text-xs text-red-600">{{ getAbsentPercent() }}%</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Kechikkanlar</p>
            <p class="text-2xl font-bold">{{ summary.lateCount || 0 }}</p>
            <span class="text-xs text-yellow-600">{{ getLatePercent() }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UsersIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  summary: {
    type: Object,
    default: () => ({
      total: 0,
      present: 0,
      absent: 0,
      attendanceRate: 0,
      lateCount: 0,
    }),
  },
})

const getAbsentPercent = () => {
  if (!props.summary.total) return '0.0'
  return ((props.summary.absent / props.summary.total) * 100).toFixed(1)
}

const getLatePercent = () => {
  if (!props.summary.present) return '0.0'
  return ((props.summary.lateCount / props.summary.present) * 100).toFixed(1)
}
</script>
