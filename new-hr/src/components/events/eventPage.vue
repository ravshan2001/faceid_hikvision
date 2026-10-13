<template>
  <eventSinxrModal  />

  <defaultHeader v-model="search" @search-event="searchEvent" />
  <defaultMain>
    <headPart name="event" :newToggleBtn="false" :count="event.count">
      <div class="w-[300px]">
        <filterSelect
          @change="updateType"
          v-model="searchEventData.user"
          name="user"
          class="w-full"
          placeholder="Выберите  сотрудника"
          :options="user_store.activeUser"
          option_title="fullName"
        />
      </div>
      <div class="w-[300px]">

        <getSelect
          @update-type="updateType"
          v-model="searchEventData.branch"
          :name="filialMessage"
          class="w-full"
          placeholder="Выберите филиал"
          :array="branch.activeBranch"
          option_title="title"
        />
      </div>
      <div>
        <getSelect
          @update-type="updateType"
          v-model="searchEventData.department"
          :name="departmentMessage"
          class="w-full"
          placeholder="Выберите отдел"
          :array="department.activeDepartment"
          option_title="name"
        />
      </div>
      <!-- <VueDatePicker 
        v-model="date" 
        :placeholder="`Выберите месяц`" 
        range :multi-calendars="{ solo: true }" 
        :locale="`ru`"
        :translations="datePickerTranslations"
        class="w-full placeholder:text-black-500 peer" /> -->
      <!-- <button
        @click="syncData"
        class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <ArrowPathIcon class="w-5 h-5" />
        Sync
      </button> -->
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
      <button
        v-if="['admin', 'boss'].includes(user?.role)"
        @click="modal.setModal(true, 'event', 'ru')"
        class="flex items-center gap-2 px-2 py-2 bg-blueColor text-white rounded hover:bg-hoverBlue"
      >
        <ArrowPathIcon class="w-5 h-5" />
      </button>
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

import defaultHeader from '@/views/home/defaultHeader.vue'
import defaultMain from '@/views/home/defaultMain.vue'
import { ArrowPathIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import eventTable from './eventTable.vue'
import eventSinxrModal from './eventSinxrModal.vue'
import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import getSelect from '@/assets/helpers/others/getSelect.vue'
import filterSelect from '@/assets/helpers/others/filterSelect.vue'

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { eventStore } from '@/stores/data/event'
const store = eventStore()
const { event } = storeToRefs(store)

import { userStore } from '@/stores/data/users'
const user_store = userStore()

import { departmentStore } from '@/stores/data/department'
const department = departmentStore()

import { branchStore } from '@/stores/data/branch'
const branch = branchStore()

import { doorStore } from '@/stores/data/door'
const door_store = doorStore()

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { modalStore } from '@/stores/helpers/modal'
const modal = modalStore()

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()




const search = ref('')

const searchEvent = async () => {
  if (search.value?.length >= 3) {
    await store.allEvent(search.value, null)
  } else {
    if (search.value) {
      await store.allEvent()
    }
  }
}
watch(search, async (newVal) => {
  if (!newVal) {
    await store.allEvent()
  }
})

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
    console.log("limited", searchEventData.value)
    await Promise.all([
      store.allEvent(searchEventData.value), 
      department.allDepartment(), 
      branch.allBranch(), 
      user_store.allUsers({limit:0}),
      door_store.allDoor({status: 'active', doorStatus:'online'})
    ])
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
