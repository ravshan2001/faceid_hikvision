<template>
  <div class="parent" v-if="count > 0 && !loading.loading">
    <div class="child">
      <div class="tableDiv">
        <table class="table">
          <thead class="thead">
            <tr>
              <th class="th-first">№</th>
              <th class="th">Название</th>
              <!-- <th class="th">Краткое название</th> -->
              <th class="th-last" v-if="['admin', 'boss'].includes(user?.role)"></th>
            </tr>
          </thead>

          <tbody class="">
            <tr
              v-for="(item, index) of reason"
              :key="item._id"
              :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover']"
            >
              <td class="td-first">{{ (page - 1) * limit + index + 1 }}</td>
              <td class="td-second">{{ item?.title }}</td>
              <!-- <td class="td">
                {{ item?.shortName }}
              </td> -->
              <td class="td-last" v-if="['admin', 'boss'].includes(user?.role)">
                <dropdownPage
                  name="reason"
                  :id="item._id"
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
import dropdownPage from '@/assets/table/dropdownPage.vue'

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)


defineProps({
  reason: {
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

import { reasonStore } from '@/stores/data/reason'
const store = reasonStore()

const removeItem = async () => {
  try {
    await store.removeReason(remove.remove?.id)
    await store.nextReason()
    remove.close()
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>