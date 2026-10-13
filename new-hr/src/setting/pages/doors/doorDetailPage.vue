<template>
  <defaultHeader  v-model="search" @search-event="searchEvent" />
  <doorDetailModal :users="users.data" title="Добавьте работника к двери" />
  <defaultSetting>
    <headPart name="detailDoor" backLink="door" :newToggleBtn="['admin', 'boss'].includes(user?.role)" :title="`Страница двери | ${ syncedDoorWorker.doorInfo?.title }`" />
    <div class="parent" v-if="syncedDoorWorker.count > 0 && !loading.loading">
      <div class="child">
        <div class="tableDiv">
          <table class="table">
            <thead class="thead">
              <tr>
                <th class="th-first">№</th>
                <th class="th"></th>
                <th class="th">{{ $t('fullName') }}</th>
                <th class="th">{{ $t('department') }}</th>
                <th class="th">Статус</th>
                <th class="th">{{ $t('date') }}</th>
                <th class="th" v-if="['admin', 'boss'].includes(user?.role)"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) of syncedDoorWorker.data" 
                :key="item._id"
                :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover']"
              >
                <td class="td-first">{{ (syncedDoorWorker.page - 1) * syncedDoorWorker.limit + index + 1 }}</td>
                
                <td class="td-img">
                  <div class="size-14 overflow-hidden">
                    <img
                    v-if="item?.user?.faceUrl?.length > 0"
                    :src="`${url}/${item?.user?.faceUrl}`"
                    alt=""
                    class="object-contain size-full cursor-pointer"
                    @click="openFaceBox(item?.user?.faceUrl, $event)"
                    />
                    <UserIcon v-else :class="['object-contain size-full text-placeholder']" />
                  </div>
                </td>
                <td class="td-second">{{ item.user?.fullName || '' }}</td>
                <td class="td">{{ item?.user?.department?.name || '' }}</td>
                <td class="td">
                  <button
                    :disabled="item.status === 'success' && ['admin', 'boss'].includes(user?.role)"
                    @click="handleClick(item)"
                    class="px-3 py-1 rounded text-white"
                    :class="{
                      'bg-green-500 cursor-not-allowed': item.status === 'success',
                      'bg-yellow-500 hover:bg-yellow-600': item.status === 'pending',
                      'bg-red-500 hover:bg-red-600': item.status === 'error'
                    }"
                  >
                    {{ item?.status == 'success'? 'Успешно': item?.status == 'pending'? 'В ожидании' : 'Ошибка' }}
                  </button>
                </td>
                <td class="td">
                  <span class="mr-3">
                    {{ convertDateShort(item?.time)}}
                  </span>
                  <span class="text-sm ">
                    {{ convertDateShort(item?.time, 'hour-second')}}
                  </span>
                </td>
                <td class="td-last" v-if="['admin', 'boss'].includes(user?.role)">
                  <dropdownPage
                    name="detailDoor"
                    edit = 'noEdit'
                    :id="item?._id"
                    :boolen="
                      index >= (syncedDoorWorker.count > 10 ? syncedDoorWorker.count - 3 : syncedDoorWorker.count) ||
                      index >= (syncedDoorWorker.count > 26 ? syncedDoorWorker.count - 5 : syncedDoorWorker.count)
                    "
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <VueEasyLightbox
      :visible="visible"
      :imgs="[currentImage]"
      @hide="closeLightbox"
    />
    <removePage @remove="removeItem()" />
    <nothingPage :visibility="syncedDoorWorker.count <= 0 && !loading.loading" />

    <paginationPage
      v-model="syncedDoorWorker.page"
      :count="syncedDoorWorker.count"
      :limit="syncedDoorWorker.limit"
      @change-page="changePage"
      :select="selectedLimit"
      @update-limit="updateLimit"
    />
  </defaultSetting>
</template>

<script setup>
import defaultSetting from '@/setting/defaultSetting.vue'
import headPart from '@/assets/helpers/others/headPart.vue'
import paginationPage from '@/assets/helpers/others/paginationPage.vue'
import defaultHeader from '@/views/home/defaultHeader.vue'
import nothingPage from '@/assets/helpers/others/nothingPage.vue'
import removePage from '@/assets/helpers/overlays/removePage.vue'
import dropdownPage from '@/assets/table/dropdownPage.vue'
import { UserIcon } from '@heroicons/vue/24/outline';
import { url } from '@/helpers/api'
import { typeDoor } from '@/helpers/object'
import { role } from '@/helpers/object';
import { convertDateShort } from '@/helpers/func';
import VueEasyLightbox from 'vue-easy-lightbox';
import doorDetailModal from './doorDetailPageModal.vue'

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { doorStore } from '@/stores/data/door'
const store = doorStore()
const { syncedDoorWorker } = storeToRefs(store)


import { userStore } from '@/stores/data/users'
const user_store = userStore()
const { users } = storeToRefs(user_store)

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()


import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)


import { removeStore } from '@/stores/helpers/remove'
const remove = removeStore()


const changePage = (value) => {
  store.changeSyncedWorkerDoorPage(value, route.params.id)
  getData()
}

const selectedLimit = ref(syncedDoorWorker.value.limit)

const updateLimit = async (value) => {
  syncedDoorWorker.value.limit = value || selectedLimit.value
  getData()
  if (syncedDoorWorker.value.page > 1) {
    syncedDoorWorker.value.page = 1
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
    await Promise.all([store.allSyncedDoorWorker({door:route.params.id}), user_store.allUsers()])
    loading.setLoading(false)
  } catch (err) {
    console.warn('Error', err)
  }
}

// Header search
const search = ref('')
const searchEvent = async () => {
  if (search.value?.length >= 2) {
    await store.allSyncedDoorWorker({door:route.params.id, fullName: search.value})
  } else {
    // if (search.value) {
    //   await store.allUsers()
    // }
  }
}


onMounted(() => {
  if (route.query.limit) {
    selectedLimit.value = Number(route.query.limit)
    syncedDoorWorker.value.limit = selectedLimit.value
  }
  store.syncedDoorWorker.page = +route.query.page || 1
  getData()
})


const handleClick = async(item) => {
  if (item.status === 'pending' || item.status === 'error') {
    await store.returnSyncedWorkerDoor(item._id);
  }
}




// Lightbox holati
const visible = ref(false);
const currentImage = ref('');


// Lightboxni ochish funksiyasi
const openLightbox = (imageUrl) => {
  currentImage.value = `${url}/${imageUrl}`;
  visible.value = true;
};
const closeLightbox = () => {
  visible.value = false;
  currentImage.value = '';
};



const removeItem = async () => {
  try {
    await store.removeSyncedWorkerDoor(remove.remove?.id)
    await store.nextDoor()
    remove.close()
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>