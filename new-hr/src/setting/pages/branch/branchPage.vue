<template>
  <branchModal />

  <defaultHeader v-model="search" @search-event="searchEvent" />
  <defaultSetting>
    <headPart name="branch" :newToggleBtn="['admin', 'boss'].includes(user?.role)" />
    <branchTable :branch="branch.data" :count="branch.count" :limit="branch.limit" :page="branch.page" />

    <paginationPage
      v-model="store.branch.page"
      :count="branch.count"
      :limit="branch.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultSetting>
</template>
<script setup>
import defaultSetting from '@/setting/defaultSetting.vue'
import defaultHeader from '@/views/home/defaultHeader.vue'
import branchModal from './branchModal.vue'
import branchTable from './branchTable.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import headPart from '@/assets/helpers/others/headPart.vue'

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { branchStore } from '@/stores/data/branch'
const store = branchStore()
const { branch } = storeToRefs(store)

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
    await store.allBranch(search.value)
  } else {
    if (search.value) {
      await store.allBranch()
    }
  }
}
watch(search, async (newVal) => {
  if (!newVal) {
    await store.allBranch()
  }
})

const changePage = (value) => {
  store.changePage(value)
  getData()
}

const selectedLimit = ref(branch.value.limit)
const updateLimit = async (value) => {
  branch.value.limit = value || selectedLimit.value
  getData()
  if (branch.value.page > 1) {
    branch.value.page = 1
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
    await Promise.all([store.allBranch()])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = Number(route.query.limit)
    branch.value.limit = selectedLimit.value
  }
  store.branch.page = +route.query.page || 1
  getData()
})
</script>
