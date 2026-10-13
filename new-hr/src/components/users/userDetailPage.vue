<template>
  <defaultHeader />
  <!-- <defaultMain> -->
  <div class="overflow-auto mainScroll p-4 pb-2 h-[calc(100%-60px)]">
    <div class="flex items-center justify-between mb-3">
      <div class="min-w-0 gap-3 flex items-center">
        <button v-if="route?.meta?.back" @click="goBack()">
          <ChevronLeftIcon
            class="w-[30px] h-[30px] rounded-md bg-btn flex justify-center items-center text-whiteText hover:bg-btnHover"
          />
        </button>
        <div class="font-medium text-xl text-mainText">Страница сотрудника</div>
      </div>
    </div>
    <div class="flex-1 overflow-auto">
      <div class="grid grid-cols-12 gap-3 h-full mb-3">
        <div class="col-span-3 bg-hover rounded-[13px] h-full overflow-auto mainScroll">
          <userInfo :worker="worker" />
        </div>
        <div class="col-span-9 bg-hover rounded-[13px] overflow-auto px-5">
          <userCalendar />
        </div>
      </div>
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-12 bg-hover rounded-[13px]">
          <TabList :list="links" />
          <div class="overflow-hidden h-[700px]">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </defaultMain> -->
</template>
<script setup>
import defaultHeader from '@/views/home/defaultHeader.vue'
import userInfo from './userInfo.vue'
import userCalendar from './userCalendar.vue'
import TabList from '@/assets/helpers/others/tabList.vue'
import {  onMounted, ref } from 'vue'
import { ChevronLeftIcon } from '@heroicons/vue/20/solid'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const id = ref('')

import { userStore } from '@/stores/data/users'
const store = userStore()
const worker = ref({})

const getData = async () => {
  if (!id.value) return false
  worker.value = await store.getUserInfo(id.value)
}

const links = [
  // {
  //   name: 'worker-statistic',
  //   title: 'Статистика'
  // },
  {
    name: 'worker-events',
    title: 'События',
  },
  {
    name: 'worker-absence',
    title: 'Отсутствие',
  },
  {
    name: 'worker-doors',
    title: 'Разрешенные двери',
  },
  {
    name: 'worker-history',
    title: 'История работы',
  },
]
function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'workers' })
    // console.log('Нет предыдущей страницы в истории.')
  }
}

onMounted(() => {
  id.value = route.params.id
  getData()
})
</script>
