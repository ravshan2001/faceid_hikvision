<template>
  <div>
    <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, locale, messages } = useI18n()

const series = ref([
  {
    name: t('chart.column.firstName'),
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
  },
  {
    name: t('chart.column.secondName'),
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  },
  {
    name: t('chart.column.thirdName'),
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: messages.value[locale.value]?.chart?.months || [],
  },
  yaxis: {
    title: {
      text: t('chart.column.text'),
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: (val) => `$ ${val} ${t('chart.column.text')}`,
    },
  },
}))

watch(
  () => locale.value,
  (newLocale) => {
    ;(series.value = [
      {
        name: t('chart.column.firstName'),
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: t('chart.column.secondName'),
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: t('chart.column.thirdName'),
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ]),
      (chartOptions.value = {
        ...chartOptions.value,
        yexis: {
          title: {
            text: t('chart.column.text'),
          },
        },
        xaxis: {
          categories: messages.value[newLocale]?.chart?.months || [],
        },
        tooltip: {
          y: {
            formatter: (val) => `$ ${val} ${t('chart.column.text')}`,
          },
        },
      })
  },
)
</script>
