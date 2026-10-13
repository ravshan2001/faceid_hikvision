<template>
  <div class="px-[25px] py-[5px] rounded-[13px] shadow-sm bg-hover space-y-4">
    <div class="flex justify-between items-center">
      <div class="text-[#817295] text-[18px] w-[55%] space-y-2">
        <div class="flex items-center gap-4">
          <div class="w-[47px] h-[47px] bg-lightGreen rounded-full flex justify-center items-center">
            <component :is="UserGroupIcon" class="size-7 text-greenColor" aria-hidden="true" />
          </div>
          <div class="text-[#483D5B] text-[24px] font-bold">
            {{ count }}
          </div>
        </div>
        <div class=" text-base">
          <div
            v-for="(item, index) of list"
            :key="index"
            class="py-2 flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <div :class="['w-3 h-3 rounded-full', `${item?.bg}`]"></div>
              <div>{{ item?.title }}</div>
            </div>
            <div class="text-[#483D5B] text-[20px] font-bold">{{ item.value }}</div>
          </div>
        </div>
      </div>
      <apexchart width="190" type="donut" :options="options" :series="series"></apexchart>
    </div>
  </div>
</template>
<script setup>
import { computed, watchEffect, defineProps } from 'vue'
const props = defineProps(['count', 'came', 'notCame'])
// Icon import
import { UserGroupIcon } from '@heroicons/vue/24/outline'
import ApexCharts from 'apexcharts'

// const series = computed(() => [props?.count?.activated || 0, props?.count?.notActivated || 0])
const series = computed(() => list.value.map((t) => t.value) || [])

const list = computed(() => [
  {
    class: '#22c55e',
    bg: 'bg-greenColor',
    title: 'Пришли',
    value:  props?.came || 0,
  },
  {
    class: '#ef4444',
    bg: 'bg-redColor',
    title: 'Не пришли',
    value: props?.notCame || 0,
  },
])

const options = computed(() => ({
  chart: {
    id: `Hr-vuechart-users`,
    type: 'donut',
    height: 180
  },
  labels: list.value.map((t) => t.title) || [],
  legend: {
    show: false
  },
  colors: list.value.map((t) => t.class) || [],
  dataLabels: {
    enabled: false
  }
}))

watchEffect(() => {
  if (series.value.every((val) => val !== undefined)) {
    ApexCharts.exec('vuechart-users', 'updateSeries', series.value)
  }
})
</script>