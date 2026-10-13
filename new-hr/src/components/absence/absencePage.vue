<template>
  <absenceModal :reasons="reason_store.activeReasons" />

  <defaultMain>
    <headPart name="worker-absence" :newToggleBtn="['admin', 'boss'].includes(user?.role)">
    </headPart>

    <absenceTable :absence="absence.data" :count="absence.count" :page="absence.page" :limit="absence.limit" />

    <paginationPage
      v-model="store.absence.page"
      :count="absence.count"
      :limit="absence.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultMain>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()


import defaultMain from '@/views/home/defaultMain.vue'
import absenceTable from './absencesTable.vue'
import absenceModal from './absenceModal.vue'
import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'



import { absenceStore } from '@/stores/data/absence'
const store = absenceStore()
const { absence } = storeToRefs(store)

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { reasonStore } from '@/stores/data/reason'
const reason_store = reasonStore()

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)


const changePage = (value) => {
  store.changePage(value)
  getData()
}

const selectedLimit = ref(absence.value?.limit)
const updateLimit = (value) => {
  absence.value.limit = value || selectedLimit.value
  getData()
  if (absence.value.page > 1) {
    absence.value.page = 1
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
    await store.allAbsence({user:route.params.id})
    await reason_store.allReasons()
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = +route.query.limit
    absence.value.limit = selectedLimit.value
  }
  store.absence.page = +route.query.page || 1
  getData()
})


</script>
