<template>
  <defaultMain>
    <div class="parent" v-if="event.count > 0 && !loading.loading">
      <div class="child">
        <div class="tableDiv">
          <table class="table">
            <thead class="thead">
              <tr>
                <th class="th-first">№</th>
                <th class="th">{{ $t('fullName') }}</th>
                <th class="th">{{ $t('department') }}</th>
                <th class="th">{{ $t('role') }}</th>
                <th class="th text-center">Филиал</th>
                <th class="th text-center">{{ $t('door') }}</th>
                <th class="th">{{ $t('date') }}</th>
                <th class="th"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) of event.data"
                :key="item._id"
                :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover']"
              >
                <td class="td-first">{{ (event.page - 1) * event.limit + index + 1 }}</td>
                
                <td class="td-second">{{ item.user?.fullName || '' }}</td>
                <td class="td">{{ item?.user?.department?.name || '' }}</td>
                <td class="td">{{ getRoleName(item.user?.role, $i18n.locale) || '' }}</td>
                <td class="td text-center">
                  {{ item.door?.branch?.title || '' }}
                </td>
                <td class="td text-center">
                  <div>
                    <div>{{ item.door?.title || '' }}</div>
                    <div 
                      class="text-sm"
                      :class="item?.action === 'exit' ? 'text-redColor' : item?.action === 'enter' ? 'text-greenColor' : ''" 
                    >{{ getDoorTypeName(item?.action, $i18n.locale) || '' }}</div>
                  </div>
                </td>
                <td class="td">
                  <div>
                    {{ convertDateShort(item?.time)}}
                  </div>
                  <div class="text-sm ">
                    {{ convertDateShort(item?.time, 'hour-second')}}
                  </div>
                </td>
                <td class="td-img">
                  <div class="overflow-hidden">
                    <img
                      v-if="item.pictureURL"
                      :src="`${url}/${item?.pictureURL}`"
                      alt=""
                      class="bject-cover aspect-[3/2] w-16 h-12 cursor-pointer"
                      @click="openLightbox(item?.pictureURL)"
                    />
                    <img
                      v-else
                      src="@/assets/images/image-not-found.png"
                      alt=""
                      class="object-contain size-full cursor-pointer"
                      @click="openLightbox(item?.pictureURL)"
                    />
                  </div>
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
    <nothingPage :visibility="event.count <= 0 && !loading.loading" />

    <paginationPage
      v-model="event.page"
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
import paginationPage from '@/assets/helpers/others/paginationPage.vue'

import nothingPage from '@/assets/helpers/others/nothingPage.vue'
import removePage from '@/assets/helpers/overlays/removePage.vue'
import { url } from '@/helpers/api'
import { typeDoor } from '@/helpers/object'
import { role } from '@/helpers/object';
import { convertDateShort } from '@/helpers/func';
import VueEasyLightbox from 'vue-easy-lightbox';

import { onMounted, ref } from 'vue'
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

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()


const changePage = (value) => {
  store.changeWorkerPage(value)
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



const getData = async () => {
  try {
    loading.setLoading(true)
    await Promise.all([store.allEvent({user:route.params.id}), department.allDepartment(), branch.allBranch(), user_store.allUsers()])
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


// Eshikni turini olamiz
const getDoorTypeName = (typeId, locale) => {
  const doorType = typeDoor.find((type) => type._id === typeId);
  return doorType ? doorType.name[locale] : '';
};
// Ishchi rollarini olamiz
const getRoleName = (roleId, locale) => {
  const roleItem = role.find((role) => role._id === roleId);
  return roleItem ? roleItem.name[locale] : '';
};

const removeItem = () => {
  // removePage uchun funksiyani yozing yoki olib tashlang
};
</script>