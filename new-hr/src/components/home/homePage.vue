<template>
  <defaultHeader />
  <defaultMain styles="overflow-y-auto pr-2">
    <!-- <div class="text-xl font-medium th">Главная страница</div> -->
    <div class="grid grid-cols-12 gap-3">
      <div class="overflow-hidden col-span-4 md-max:col-span-12 flex flex-col gap-3">
        <!-- <homeAllCount :count="countAllEvent" /> -->
        <homeDoorstatus  />
        <homeEventStatistic :count="store.countAllEvent.value?.count" :came="store.countAllEvent.value?.came" :notCame="store.countAllEvent.value?.notCame" />
        <lastEvent v-if="store.countAllEvent.value?.lastEnter" :lastEvent="store.countAllEvent.value?.lastEnter"  />
        <lastEvent v-if="store.countAllEvent.value?.lastExit" :lastEvent="store.countAllEvent.value?.lastExit" />
        <!-- <pre>{{ lastStatistic }}</pre> -->
      </div>
      <div class="overflow-hidden col-span-8 md-max:col-span-12 gap-4 flex flex-col">
        <lastEventTable :lastEvents="store.countAllEvent.value?.lastEvents" />
      </div>
    </div>
    <!-- <lineChart />
    <columnChart />
    <areaChart /> -->
  </defaultMain>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'


import defaultHeader from '@/views/home/defaultHeader.vue'
import defaultMain from '@/views/home/defaultMain.vue'
import homeEventStatistic from './homeEventStatistic.vue'
import lastEvent from './lastEvent.vue'
import lastEventTable from './lastEventTable.vue'
import homeAllCount from './homeAllCountEvents.vue'
import homeDoorstatus from './homeDoorStatus.vue'

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()


import { statisticStore } from '@/stores/data/statistic'
const store = statisticStore()

const getData = async () => {
  try {
    loading.setLoading(true)
    await store.getHomeLastEventsInfo()
    // await store.getHomeLastInfo()
    
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}


onMounted(() => {
  getData()
})
</script>
