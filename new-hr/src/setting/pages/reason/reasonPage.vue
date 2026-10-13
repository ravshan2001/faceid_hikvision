<template>
  <reasonModal />

  <defaultHeader v-model="search" @search-event="searchEvent" />
  <defaultSetting>
    <headPart name="reason" :newToggleBtn="['admin', 'boss'].includes(user?.role)" />
    <reasonTable :reason="reason.data" :count="reason.count" :limit="reason.limit" :page="reason.page" />

    <paginationPage
      v-model="store.reason.page"
      :count="reason.count"
      :limit="reason.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultSetting>
</template>
<script setup>
import defaultSetting from '@/setting/defaultSetting.vue'
import defaultHeader from '@/views/home/defaultHeader.vue'
import reasonModal from './reasonModal.vue'
import reasonTable from './reasonTable.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import headPart from '@/assets/helpers/others/headPart.vue'

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { reasonStore } from '@/stores/data/reason'
const store = reasonStore()
const { reason } = storeToRefs(store)

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)

const search = ref('')
const searchEvent = async () => {
  if (search.value?.length >= 3) {
    await store.allReasons(search.value)
  } else {
    if (search.value) {
      await store.allReasons()
    }
  }
}
watch(search, async (newVal) => {
  if (!newVal) {
    await store.allReasons()
  }
})

const changePage = (value) => {
  store.changePage(value)
  getData()
}

const selectedLimit = ref(reason.value.limit)
const updateLimit = async (value) => {
  reason.value.limit = value || selectedLimit.value
  getData()
  if (reason.value.page > 1) {
    reason.value.page = 1
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
    await Promise.all([store.allReasons()])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = Number(route.query.limit)
    reason.value.limit = selectedLimit.value
  }
  store.reason.page = +route.query.page || 1
  getData()
})
</script>
