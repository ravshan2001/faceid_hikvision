<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <ChartBarIcon class="w-5 h-5 mr-2 text-blue-600" />
        Davomat Trendi
      </h3>
      <div class="flex gap-2">
        <button
          v-for="p in periods"
          :key="p.value"
          @click="$emit('change-period', p.value)"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-lg transition-colors',
            p.value === currentPeriod
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          {{ p.label }}
        </button>
      </div>
    </div>
    <div class="h-80">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'

// ✅ MUHIM: Controller'larni register qilish
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  currentPeriod: {
    type: String,
    default: 'week',
  },
})

defineEmits(['change-period'])

const periods = [
  { value: 'week', label: 'Hafta' },
  { value: 'month', label: 'Oy' },
  { value: 'year', label: 'Yil' },
]

const chartRef = ref(null)
let chart = null

const initChart = () => {
  if (!chartRef.value || !props.data?.length) return

  const ctx = chartRef.value.getContext('2d')
  
  if (chart) {
    chart.destroy()
  }

  const labels = props.data.map((item) => {
    const date = new Date(item.date)
    return date.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })
  })
  const values = props.data.map((item) => item.count)

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Davomat',
          data: values,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(59, 130, 246)',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          displayColors: false,
          callbacks: {
            label: (context) => `Davomat: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { 
            precision: 0,
            font: { size: 12 },
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: { size: 11 },
          },
        },
      },
    },
  })
}

const updateChart = () => {
  if (!chart || !props.data?.length) {
    initChart()
    return
  }

  const labels = props.data.map((item) => {
    const date = new Date(item.date)
    return date.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })
  })
  const values = props.data.map((item) => item.count)

  chart.data.labels = labels
  chart.data.datasets[0].data = values
  chart.update('none')
}

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  setTimeout(() => {
    initChart()
  }, 100)
})

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>
