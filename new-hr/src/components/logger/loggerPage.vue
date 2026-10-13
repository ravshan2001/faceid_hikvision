<template>
  <defaultHeader />
  <defaultMain>
    <headPart name="logger" :newToggleBtn="false">
      <div class="flex gap-2">
        <button
          :class="[
            'btn',
            logger.state.type === 'router' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          ]"
          @click="changeType('router')"
        >
          Logger Router
        </button>
        <button
          :class="[
            'btn',
            logger.state.type === 'door' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          ]"
          @click="changeType('door')"
        >
          Logger Door
        </button>
      </div>
    </headPart>

    <component
      :is="logger.state.type === 'router' ? 'childLoggerRouter' : 'childLoggerDoor'"
    />

    <paginationPage
      v-model="logger.state.page"
      :count="logger.state.count"
      :limit="logger.state.limit"
      @change-page="changePage"
      @update-limit="updateLimit"
    />
  </defaultMain>
</template>

<script setup>
import defaultHeader from '@/views/home/defaultHeader.vue'
import defaultMain from '@/views/home/defaultMain.vue'
import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'

import childLoggerRouter from './childLoggerRouter.vue'
import childLoggerDoor from './childLoggerDoor.vue'

import { onMounted } from 'vue'
import { loggerStore } from '@/stores/data/logger'
const logger = loggerStore()

const changePage = (val) => {
  logger.changePage(val)
  logger.getLoggerData()
}

const updateLimit = (val) => {
  logger.updateLimit(val)
  logger.getLoggerData()
}

const changeType = (type) => {
  logger.setType(type)
  logger.getLoggerData()
}

onMounted(() => {
  logger.getLoggerData()
})
</script>
