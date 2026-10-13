<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <BuildingOfficeIcon class="w-5 h-5 mr-2 text-blue-600" />
      Bo'limlar bo'yicha
    </h3>
    <div class="h-80">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { BuildingOfficeIcon } from '@heroicons/vue/24/outline'

// ✅ MUHIM: Controller'larni register qilish
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const chartRef = ref(null)
let chart = null

const initChart = () => {
  if (!chartRef.value || !props.data?.length) return

  const ctx = chartRef.value.getContext('2d')
  
  if (chart) {
    chart.destroy()
  }

  const labels = props.data.map((item) => item.department)
  const presentData = props.data.map((item) => item.present)
  const absentData = props.data.map((item) => item.absent)

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Ishda',
          data: presentData,
          backgroundColor: 'rgb(34, 197, 94)',
          borderRadius: 6,
          barThickness: 30,
        },
        {
          label: "Yo'q",
          data: absentData,
          backgroundColor: 'rgb(239, 68, 68)',
          borderRadius: 6,
          barThickness: 30,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: { size: 12 },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          callbacks: {
            label: (context) => {
              const total = presentData[context.dataIndex] + absentData[context.dataIndex]
              const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0
              return `${context.dataset.label}: ${context.parsed.y} (${percentage}%)`
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 11 },
          },
        },
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
      },
    },
  })
}

const updateChart = () => {
  if (!chart || !props.data?.length) {
    initChart()
    return
  }

  const labels = props.data.map((item) => item.department)
  const presentData = props.data.map((item) => item.present)
  const absentData = props.data.map((item) => item.absent)

  chart.data.labels = labels
  chart.data.datasets[0].data = presentData
  chart.data.datasets[1].data = absentData
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
