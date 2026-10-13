<template>
  <div class="parent" v-if="count > 0 && !loading.loading">
    <div class="child">
      <div class="tableDiv">
        <table class="table">
          <thead class="thead">
            <tr>
              <th class="th-first">№</th>
              <th class="th">Филиал</th>
              <th class="th">{{ $t('title') }}</th>
              <th class="th">IP</th>
              <th class="th">Порт</th>
              <th class="th">{{ $t('login') }}</th>
              <th class="th">{{ $t('type') }}</th>
              <th class="th">{{ $t('status') }}</th>
              <th class="th-last" v-if="['admin', 'boss'].includes(user?.role)"></th>
            </tr>
          </thead>

          <tbody class="">
            <tr
              v-for="(item, index) of door"
              :key="item?._id"
              :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover cursor-pointer']"
              
            >
              <td class="td-first">{{ (page - 1) * limit + index + 1 }}</td>
              <td 
                class="td-second" 
                @click="item?._id && $router.push({ name: 'detailDoor', params: { id: item?._id } })" 
              >
                {{ item?.branch?.title }}
              </td>
              <td class="td-second">{{ item?.title }}</td>
              <td class="td">
                <a target="_blank" :href="`http://${item?.ip}:${item?.port}`">{{ item?.ip }}</a>
              </td>
              <td class="td">{{ item?.port }}</td>
              <td class="td">{{ item?.login || '' }}</td>
              <td class="td">
                {{ item?.type?.toUpperCase() || '' }}
              </td>
              <td class="td">
                <checkboxPage 
                  :modelValue="item.status === 'active'"
                  @update:modelValue="val => {
                    item.status = val ? 'active' : 'inactive'
                    store.statusDoor(item._id)
                  }"
                  :disabled="!['admin', 'boss'].includes(user?.role)" 
                />
              </td>
              <td class="td-last" v-if="['admin', 'boss'].includes(user?.role)">
                <dropdownPage
                  name="door"
                  :id="item?._id"
                  :boolen="
                    index >= (count > 10 ? count - 3 : count) ||
                    index >= (count > 26 ? count - 5 : count)
                  "
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <removePage @remove="removeItem()" />

  <nothingPage :visibility="count <= 0 && !loading.loading" />
</template>
<script setup>
import { storeToRefs } from 'pinia'
import nothingPage from '@/assets/helpers/others/nothingPage.vue'
import removePage from '@/assets/helpers/overlays/removePage.vue'
import checkboxPage from '@/assets/helpers/others/checkboxPage.vue'
import dropdownPage from '@/assets/table/dropdownPage.vue'

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)



defineProps({
  door: {
    type: Array,
    requreid: true,
  },
  count: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
})

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { removeStore } from '@/stores/helpers/remove'
const remove = removeStore()

import { doorStore } from '@/stores/data/door'
const store = doorStore()

const removeItem = async () => {
  try {
    await store.removeDoor(remove.remove?.id)
    await store.nextDoor()
    remove.close()
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>
