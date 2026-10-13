<template>
  <departmentModal :parent="department.parent" :users="user_store.activeUser" />

  <defaultHeader v-model="search" @search-event="searchEvent" />
  <defaultMain>
    <headPart name="department" :newToggleBtn="['admin', 'boss'].includes(user?.role)" :count="department.count"/>

    <departmentTable
      :department="department.data"
      :count="department.count"
      :page="department.page"
      :limit="department.limit"
    />

    <paginationPage
      v-model="department_store.department.page"
      :count="department.count"
      :limit="department.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultMain>
</template>
<script setup>
import defaultHeader from '@/views/home/defaultHeader.vue'
import defaultMain from '@/views/home/defaultMain.vue'
import headPart from '@/assets/helpers/others/headPart.vue'
import departmentModal from './departmentModal.vue'
import departmentTable from './departmentTable.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import typeSelect from '@/assets/helpers/others/typeSelect.vue'
import { type } from '@/helpers/object'

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { departmentStore } from '@/stores/data/department'
const department_store = departmentStore()
const { department } = storeToRefs(department_store)

import { userStore } from '@/stores/data/users'
const user_store = userStore()

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)


import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

const changePage = (value) => {
  department_store.changePage(value)
  getData()
}


const search = ref('')

const searchEvent = async () => {
  if (search.value?.length >= 2) {
    await department_store.allDepartment(null, search.value)
  } else {
    if (search.value) {
      await department_store.allDepartment()
    }
  }
}
watch(search, async (newVal) => {
  if (!newVal) {
    await department_store.allDepartment()
  }
})



const selectedLimit = ref(department.value.limit)
const updateLimit = (value) => {
  // console.log(value)

  department.value.limit = value || selectedLimit.value
  getData()

  if (department.value.page > 1) {
    department.value.page = 1
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
    await Promise.all([
      department_store.allDepartment(),
      department_store.getParent(),
      // user_store.allUsers({limit:0}),
    ])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(async () => {
  if (route.query.limit) {
    selectedLimit.value = Number(route.query.limit)
    department.value.limit = selectedLimit.value
  }
  department_store.department.page = +route.query.page || 1
  getData()
})

</script>
