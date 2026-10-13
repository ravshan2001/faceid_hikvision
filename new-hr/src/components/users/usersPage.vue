<template>
  <usersModal :department="d_store.activeDepartment" :door="door_store.door.data" />

  <defaultHeader v-model="search" @search-event="searchEvent" />
  <defaultMain>
    <headPart
      name="workers"
      :newToggleBtn="['admin', 'boss'].includes(user?.role)"
      :count="users.count"
    >
      <div class="w-[250px]">
        <getSelect
          @update-type="updateType"
          v-model="searchUserData.department"
          :name="departmentMessage"
          class="w-full"
          placeholder="Выберите отдел"
          :array="d_store.activeDepartment"
          option_title="name"
        />
      </div>
      <div class="w-[220px]">
        <typeSelect
          @update-type="updateType"
          v-model="searchUserData.role"
          class="w-full"
          placeholder="Выберите роль"
          :name="roleMessage"
          :array="role"
        />
      </div>
      <div class="w-[220px]">
        <getSelect
          @update-type="updateType"
          v-model="searchUserData.gender"
          :name="genderMessage"
          class="w-full"
          placeholder="Выберите пол"
          :array="genders"
          option_title="name"
        />
      </div>
      <div class="w-[220px]">
        <getSelect
          @update-type="updateType"
          v-model="searchUserData.presence"
          :name="presencesMessage"
          class="w-full"
          placeholder="Выберите присутствие"
          :array="presences"
          option_title="name"
        />
      </div>
      <button
        @click="clearSearch"
        class="flex items-center gap-2 px-2 py-2 bg-redColor text-white rounded hover:bg-hoverRed"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
      <button
        @click="updateType"
        class="flex items-center gap-2 px-2 py-2 bg-greenColor text-white rounded hover:bg-hoverGreen"
      >
        <MagnifyingGlassIcon class="w-5 h-5" />
      </button>
    </headPart>

    <usersTable
      :workers="users.data"
      :count="users.count"
      :page="users.page"
      :limit="users.limit"
    />

    <paginationPage
      v-model="store.users.page"
      :count="users.count"
      :limit="users.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultMain>
</template>
<script setup>
import defaultHeader from '@/views/home/defaultHeader.vue'
import defaultMain from '@/views/home/defaultMain.vue'
import usersTable from './usersTable.vue'
import usersModal from './usersModal.vue'
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import typeSelect from '@/assets/helpers/others/typeSelect.vue'
import { gender, role } from '@/helpers/object'
import getSelect from '@/assets/helpers/others/getSelect.vue'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { userStore } from '@/stores/data/users'
const store = userStore()
const { users } = storeToRefs(store)

import { departmentStore } from '@/stores/data/department'
const d_store = departmentStore()

import { doorStore } from '@/stores/data/door'
const door_store = doorStore()

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

const search = ref('')
const searchEvent = async () => {
  if (search.value?.length >= 2) {
    await store.allUsers(null, search.value)
  } else {
    // if (search.value) {
    //   await store.allUsers()
    // }
  }
}
// watch(search, async (newVal) => {
//   if (!newVal) {
//     await store.allUsers()
//   }
// })

const presences = ref([
  { _id: 'came', name: 'Пришедшие' },
  { _id: 'not came', name: 'Не пришедшие' },
])
const genders = ref([
  { _id: 'male', name: 'Мужской' },
  { _id: 'female', name: 'Женский' },
])

const changePage = (value) => {
  store.changePage(value, route.query)
  getData()
}

const selectedLimit = ref(users.value?.limit)
const updateLimit = (value) => {
  users.value.limit = value || selectedLimit.value
  getData()
  if (users.value.page > 1) {
    users.value.page = 1
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

const searchUserData = ref({
  department: '',
  role: '',
  presence: '',
  gender: '',
})

const updateType = async () => {
  if (searchUserData.value) {
    loading.setLoading(true)
    const filtered = Object.fromEntries(
      Object.entries(searchUserData.value).filter(([_, v]) => v !== ''),
    )
    // router.replace({ query: { ...route.query, ...filtered } })
    store.changePage(1, { ...route.query, ...filtered })
    await store.allUsers(filtered)
    return loading.setLoading(false)
  }
  getData()
}

const clearSearch = async () => {
  searchUserData.value = {
    department: '',
    role: '',
    presence: '',
    gender: '',
  }
  changePage(1)
  router.replace({ query: { limit: selectedLimit.value } })
  // getData()
}

const getData = async () => {
  try {
    const filtered = Object.fromEntries(
      Object.entries(searchUserData.value).filter(([_, v]) => v !== ''),
    )
    loading.setLoading(true)
    await Promise.all([
      store.allUsers(filtered),
      d_store.allDepartment(),
      door_store.allDoor({ status: 'active', doorStatus: 'online' }),
    ])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = +route.query.limit
    users.value.limit = selectedLimit.value
  }
  if (route.query.page) {
    users.value.page = +route.query.page
  }
  if (route.query.department) {
    searchUserData.value.department = route.query.department
  }
  if (route.query.role) {
    searchUserData.value.role = route.query.role
  }
  if (route.query.presence) {
    searchUserData.value.presence = route.query.presence
  }
  if (route.query.gender) {
    searchUserData.value.gender = route.query.gender
  }

  store.users.page = +route.query.page || 1
  getData()
})

const roleMessage = {
  en: 'Role',
  ru: 'Роль',
  uz: 'Roli',
  kr: 'Роли',
}
const departmentMessage = {
  en: 'Department',
  ru: 'Отдел',
  uz: 'Bo‘lim',
  kr: 'Бўлим',
}
const presencesMessage = {
  en: 'Presence',
  ru: 'Присутствие',
  uz: 'Присутство',
  kr: 'Присутствие',
}
const genderMessage = {
  en: 'Gender',
  ru: 'Пол',
  uz: 'Jins',
  kr: 'Жинс',
}
</script>
