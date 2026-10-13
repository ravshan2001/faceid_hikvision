<template>
  <doorModal />

  <defaultHeader v-model="search" @search-event="searchEvent" />
  <defaultSetting>
    <headPart name="door" :newToggleBtn="['admin', 'boss'].includes(user?.role)" />
    <doorTable :door="door.data" :count="door.count" :limit="door.limit" :page="door.page" />

    <paginationPage
      v-model="store.door.page"
      :count="door.count"
      :limit="door.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultSetting>
</template>
<script setup>
import defaultSetting from '@/setting/defaultSetting.vue'
import defaultHeader from '@/views/home/defaultHeader.vue'
import doorModal from './doorModal.vue'
import doorTable from './doorTable.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import headPart from '@/assets/helpers/others/headPart.vue'

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { doorStore } from '@/stores/data/door'
const store = doorStore()
const { door } = storeToRefs(store)

import { branchStore } from '@/stores/data/branch'
const branch_store = branchStore()

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
    await store.allDoor(search.value)
  } else {
    if (search.value) {
      await store.allDoor()
    }
  }
}
watch(search, async (newVal) => {
  if (!newVal) {
    await store.allDoor()
  }
})

const changePage = (value) => {
  store.changePage(value)
  getData()
}

const selectedLimit = ref(door.value.limit)
const updateLimit = async (value) => {
  door.value.limit = value || selectedLimit.value
  getData()
  if (door.value.page > 1) {
    door.value.page = 1
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
    await Promise.all([store.allDoor(), branch_store.allBranch()])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = Number(route.query.limit)
    door.value.limit = selectedLimit.value
  }
  store.door.page = +route.query.page || 1
  getData()
})
</script>
