<template>
  <defaultMain>
    <headPart name="logger-router" :newToggleBtn="false" :count="event.count">
      
    </headPart>

    <eventTable
      :events="event.data"
      :count="event.count"
      :limit="event.limit"
      :page="event.page"
    />

    <paginationPage
      v-model="store.event.page"
      :count="event.count"
      :limit="event.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultMain>
</template>
<script setup>

import defaultMain from '@/views/home/defaultMain.vue'
import eventTable from './eventTable.vue'
import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import getSelect from '@/assets/helpers/others/getSelect.vue'

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { loggerStore } from '@/stores/data/logger'
const store = loggerStore()
const { loggerRouter } = storeToRefs(store)


import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { modalStore } from '@/stores/helpers/modal'
const modal = modalStore()


import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()



const changePage = (value) => {
  store.changePage(value)
  getData()
}





const selectedLimit = ref(event.value.limit)

const updateLimit = async (value) => {
  event.value.limit = value || selectedLimit.value
  getData()
  if (event.value.page > 1) {
    event.value.page = 1
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




const searchEventData = ref({
  branch: '',
  department: '',
  user: '',
})
const updateType = async () => {
  if (searchEventData.value) {
    loading.setLoading(true);
    // console.log('searchEventData:', searchEventData.value);

    try {
      await store.allEvent(searchEventData.value);
    } catch (err) {
      console.error('Error in store.allEvent:', err);
    }

    loading.setLoading(false);
  }
};
const clearSearch = async () => {
  searchEventData.value = {
    branch: '',
    department: '',
    user: '',
  }
  await store.allEvent()
};

const getData = async () => {
  try {
    loading.setLoading(true)
    await Promise.all([store.allEvent(searchEventData.value), department.allDepartment(), branch.allBranch(), user_store.allUsers()])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = Number(route.query.limit)
    event.value.limit = selectedLimit.value
  }
  store.event.page = +route.query.page || 1
  getData()
})

const departmentMessage = {
  en: 'Department',
  ru: 'Отдел',
  uz: 'Bo‘lim',
  kr: 'Бўлим',
}
const filialMessage = {
  en: 'Branch',
  ru: 'Филиал',
  uz: 'Filial',
  kr: 'Филиал',
}
const userMessage = {
  en: 'User',
  ru: 'Сотрудник',
  uz: 'Xodim',
  kr: 'Ходим',
}
</script>