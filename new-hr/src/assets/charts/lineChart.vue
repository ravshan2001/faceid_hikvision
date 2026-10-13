<template>
  <div>
    <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, locale, messages } = useI18n()

const series = ref([
  {
    name: 'Desktops',
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
  },
])

const chartOptions = ref({
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
  },
  title: {
    text: t('chart.line.text'),
    align: 'left',
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: messages.value[locale.value]?.chart?.months || [],
  },
})

watch(
  () => locale.value,
  (newLocale) => {
    chartOptions.value = {
      ...chartOptions.value,
      title: {
        text: t('chart.line.text'),
        align: 'left',
      },
      xaxis: {
        categories: messages.value[newLocale]?.chart?.months || [],
      },
    }
  },
)
</script>
