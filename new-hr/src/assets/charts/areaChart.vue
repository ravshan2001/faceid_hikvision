<template>
  <div>
    <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const series = ref([
  {
    name: t('chart.spline.firstName'),
    data: [31, 40, 28, 51, 42, 109, 100],
  },
  {
    name: t('chart.spline.secondName'),
    data: [11, 32, 45, 32, 34, 52, 41],
  },
])

const chartOptions = computed(() => ({
  chart: {
    height: 350,
    type: 'area',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    type: 'datetime',
    categories: [
      '2018-09-19T00:00:00.000Z',
      '2018-09-19T01:30:00.000Z',
      '2018-09-19T02:30:00.000Z',
      '2018-09-19T03:30:00.000Z',
      '2018-09-19T04:30:00.000Z',
      '2018-09-19T05:30:00.000Z',
      '2018-09-19T06:30:00.000Z',
    ],
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm',
    },
  },
}))

watch(
  () => locale.value,
  () => {
    series.value = [
      {
        name: t('chart.spline.firstName'),
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: t('chart.spline.secondName'),
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ]
  },
)
</script>
