<template>
  <holidayModal />

  <defaultHeader v-model="search" @search-event="searchEvent" />
  <defaultSetting>
    <headPart name="holiday" :newToggleBtn="['admin', 'boss'].includes(user?.role)" />
    <holidayTable :holiday="holiday.data" :count="holiday.count" :limit="holiday.limit" :page="holiday.page" />

    <paginationPage
      v-model="store.holiday.page"
      :count="holiday.count"
      :limit="holiday.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultSetting>
</template>
<script setup>
import defaultSetting from '@/setting/defaultSetting.vue'
import defaultHeader from '@/views/home/defaultHeader.vue'
import holidayModal from './holidayModal.vue'
import holidayTable from './holidayTable.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import headPart from '@/assets/helpers/others/headPart.vue'

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { holidayStore } from '@/stores/data/holiday'
const store = holidayStore()
const { holiday } = storeToRefs(store)

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
    await store.allHoliday(search.value)
  } else {
    if (search.value) {
      await store.allHoliday()
    }
  }
}
watch(search, async (newVal) => {
  if (!newVal) {
    await store.allHoliday()
  }
})

const changePage = (value) => {
  store.changePage(value)
  getData()
}

const selectedLimit = ref(holiday.value.limit)
const updateLimit = async (value) => {
  holiday.value.limit = value || selectedLimit.value
  getData()
  if (holiday.value.page > 1) {
    holiday.value.page = 1
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
    await Promise.all([store.allHoliday()])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = Number(route.query.limit)
    holiday.value.limit = selectedLimit.value
  }
  store.holiday.page = +route.query.page || 1
  getData()
})
</script>
