<template>
  <logoutPage />
  <overlayMenu />
  <searchPage />
  <div :class="['h-full flex']">
    <defaultAside />
    <div class="h-full flex-1 overflow-hidden">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import defaultAside from '@/views/home/defaultAside.vue'
import overlayMenu from '@/assets/helpers/overlays/overlayMenu.vue'
import searchPage from '@/assets/helpers/overlays/searchPage.vue'
import logoutPage from '@/assets/helpers/overlays/logoutPage.vue'

import { socket } from '@/socket'
import { statisticStore } from '@/stores/data/statistic'

const store = statisticStore()

const onNewEvents = ({ count, events }) => {
  if (!events?.length) return
  store.onLiveEvent(events)
}

onMounted(() => {
  socket.on('new-events', onNewEvents)
})

onBeforeUnmount(() => {
  socket.off('new-events', onNewEvents)
})
</script>
