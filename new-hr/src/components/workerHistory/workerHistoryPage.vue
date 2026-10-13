<template>
  <workerHistoryModal />

  <defaultMain>
    <headPart
      title=" "
      name="worker-history"
      :newToggleBtn="['admin', 'boss'].includes(user?.role)"
    />

    <workerHistoryTable
      :workerHistories="workerHistory.data"
      :count="workerHistory.count"
      :limit="workerHistory.limit"
      :page="workerHistory.page"
    />

    <paginationPage
      v-model="store.workerHistory.page"
      :count="workerHistory.count"
      :limit="workerHistory.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultMain>
</template>
<script setup>
import defaultMain from '@/views/home/defaultMain.vue'
import workerHistoryModal from './workerHistoryModal.vue'
import workerHistoryTable from './workerHistoryTable.vue'
import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'

import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { workerHistoryStore } from '@/stores/data/workerHistory'
const store = workerHistoryStore()
const { workerHistory } = storeToRefs(store)

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)

const changePage = (value) => {
  store.changePage(value)
  getData()
}

const selectedLimit = ref(workerHistory.value.limit)
const updateLimit = async (value) => {
  workerHistory.value.limit = value || selectedLimit.value
  getData()
  if (workerHistory.value.page > 1) {
    workerHistory.value.page = 1
    route.query.page = 1
    getData()
  }
  const newQuery = { ...route.query }
  if (value !== 30) {
    newQuery.limit = value
  } else {
    delete newQuery.limit
  }
  router.replace({ query: newQuery })
}

const getData = async () => {
  try {
    loading.setLoading(true)
    await Promise.all([store.allWorkerHistory(route.params.id)])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = Number(route.query.limit)
    workerHistory.value.limit = selectedLimit.value
  }
  store.workerHistory.page = +route.query.page || 1
  getData()
})
</script>
