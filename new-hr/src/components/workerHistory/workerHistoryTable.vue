<template>
  <div class="parent" v-if="count > 0 && !loading.loading">
    <div class="child">
      <div class="tableDiv">
        <table class="table">
          <thead class="thead">
            <tr>
              <th class="th-first">№</th>
              <th class="th">Компания</th>
              <th class="th">Должность</th>
              <th class="th">Дата входа</th>
              <th class="th">Дата выхода</th>
              <th class="th-last" v-if="['admin', 'boss'].includes(user?.role)"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) of workerHistories"
              :key="item._id"
              :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover']"
            >
              <td class="td-first">{{ (page - 1) * limit + index + 1 }}</td>
              <td class="td-second">{{ item?.company || '' }}</td>
              <td class="td">{{ item?.staffPosition || '' }}</td>
              <td class="td">{{ convertDateShort(item?.enterDate) }}</td>
              <td class="td">{{ item?.leaveDate ? convertDateShort(item?.leaveDate) : '-'}}</td>
              <td class="td-last" v-if="['admin', 'boss'].includes(user?.role)">
                <dropdownPage
                  name="worker-history"
                  :id="item._id"
                  :boolen="index >= (count > 8 ? count - 3 : count)"
                />
                <tableButton name="worker-history" :id="item._id" />
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
import nothingPage from '@/assets/helpers/others/nothingPage.vue'
import removePage from '@/assets/helpers/overlays/removePage.vue'
import { url } from '@/helpers/api'
import { UserIcon } from '@heroicons/vue/24/outline'
import dropdownPage from '@/assets/table/dropdownPage.vue'
import tableButton from '@/assets/table/tableButton.vue'
import { convertDateShort } from '@/helpers/func';
import { useRoute } from 'vue-router'
const route = useRoute()
import { storeToRefs } from 'pinia'

defineProps({
  workerHistories: {
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

import { workerHistoryStore } from '@/stores/data/workerHistory'
const store = workerHistoryStore()

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)

const removeItem = async () => {
  try {
    await store.removeWorker(remove.remove?.id)
    await store.nextWorker(limit=1,route.params.id)
    remove.close()
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>
