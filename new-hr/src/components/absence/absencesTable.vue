<template>
  <div v-if="count > 0 && !loading.loading" class="parent">
    <div class="child">
      <div class="tableDiv">
        <table class="table">
          <thead class="thead">
            <tr>
              <th class="th-first">№</th>
              <th class="th">Заголовок</th>
              <th class="th">Причина</th>
              <th class="th">Описание</th>
              <th class="th">Дата</th>
              <th class="th-last" v-if="['admin', 'boss'].includes(user?.role)"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) of absence"
              :key="item._id"
              class='cursor-pointer'
              :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover']"
              
            >
              <td class="td-first">{{ (page - 1) * limit + index + 1 }}</td>
              <td 
                class="td"
              >
                {{ item?.title || '' }}
              </td>
              <td class="td">
                {{ item?.reason?.title }}
              </td>
              <td class="td">
                {{ item?.description || '' }}
              </td>
              <td class="td">
                {{ convertDateShort(item?.start) }} - {{ convertDateShort(item?.end) }}
              </td>
              <td class="td-last" v-if="['admin', 'boss'].includes(user?.role)">
                <dropdownPage
                  name="worker-absence"
                  :id="item._id"
                  :boolen="index >= (count > 8 ? count - 3 : count)"
                />
                <tableButton name="worker-absence" :id="item._id" />
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
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import nothingPage from '@/assets/helpers/others/nothingPage.vue'
import removePage from '@/assets/helpers/overlays/removePage.vue'
import dropdownPage from '@/assets/table/dropdownPage.vue'
import tableButton from '@/assets/table/tableButton.vue'
import { convertDateShort } from '@/helpers/func';


defineProps({
  absence: {
    type: Array,
    required: true,
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

import { absenceStore } from '@/stores/data/absence'
const absence_store = absenceStore()

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { removeStore } from '@/stores/helpers/remove'
const remove = removeStore()

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)

const removeItem = async () => {
  try {
    await absence_store.removeAbsence(remove.remove?.id)
    await absence_store.nextAbsence()
    remove.close()
  } catch (err) {
    console.warn('Error Remove User', err)
  }
}

</script>