<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <ClockIcon class="w-5 h-5 mr-2 text-yellow-600" />
        Kechikkanlar
      </h3>
      <span class="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        {{ lateArrivals.length }} xodim
      </span>
    </div>

    <div v-if="lateArrivals.length === 0" class="text-center py-12">
      <CheckCircleIcon class="w-16 h-16 mx-auto text-green-500 mb-3" />
      <p class="text-gray-600">Bugun hech kim kechikmadi!</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(item, index) in displayedItems"
        :key="index"
        class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {{ getInitials(item.fullName) }}
          </div>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-gray-900">{{ item.fullName }}</p>
          <p class="text-xs text-gray-500">№{{ item.employeeNo }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-mono text-gray-700">{{ formatTime(item.time) }}</p>
          <span
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
              getLateClass(item.lateMinutes),
            ]"
          >
            +{{ item.lateMinutes }} daqiqa
          </span>
        </div>
      </div>

      <button
        v-if="lateArrivals.length > 5"
        @click="showAll = !showAll"
        class="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {{ showAll ? 'Kamroq ko\'rish' : `Yana ${lateArrivals.length - 5} ta ko'rish` }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ClockIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  lateArrivals: {
    type: Array,
    default: () => [],
  },
})

const showAll = ref(false)

const displayedItems = computed(() => {
  return showAll.value ? props.lateArrivals : props.lateArrivals.slice(0, 5)
})

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0]
  }
  return name[0]
}

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
}

const getLateClass = (minutes) => {
  if (minutes > 60) return 'bg-red-100 text-red-800'
  if (minutes > 30) return 'bg-orange-100 text-orange-800'
  return 'bg-yellow-100 text-yellow-800'
}
</script>
