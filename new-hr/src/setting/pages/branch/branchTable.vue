<template>
  <div class="parent" v-if="count > 0 && !loading.loading">
    <div class="child">
      <div class="tableDiv">
        <table class="table">
          <thead class="thead">
            <tr>
              <th class="th-first">№</th>
              <th class="th">Название</th>
              <th class="th">Описание</th>
              <th class="th">Статус</th>
              <th class="th">Дата</th>
              <th class="th-last" v-if="['admin', 'boss'].includes(user?.role)"></th>
            </tr>
          </thead>

          <tbody class="">
            <tr
              v-for="(item, index) of branch"
              :key="item._id"
              :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover']"
            >
              <td class="td-first">{{ (page - 1) * limit + index + 1 }}</td>
              <td class="td-second">{{ item?.title }}</td>
              <td class="td-second">{{ item?.description }}</td>
              <td class="td">
                <!-- <checkboxPage v-model="item.status" @click="store.statusBranch(item._id)" /> -->
                <checkboxPage 
                  :modelValue="item.status === 'active'"
                  @update:modelValue="val => {
                    item.status = val ? 'active' : 'inactive'
                    store.statusBranch(item._id)
                  }" 
                  :disabled="!['admin', 'boss'].includes(user?.role)"
                />
              </td>
              <td class="td">
                {{ convertDateShort(item?.createdAt) }}
              </td>
              <td class="td-last" v-if="['admin', 'boss'].includes(user?.role)">
                <dropdownPage
                  name="branch"
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
import checkboxPage from '@/assets/helpers/others/checkboxPage.vue'
import dropdownPage from '@/assets/table/dropdownPage.vue'
import { convertDateShort } from '@/helpers/func';



import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)


defineProps({
  branch: {
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

import { branchStore } from '@/stores/data/branch'
const store = branchStore()

const removeItem = async () => {
  try {
    await store.removeBranch(remove.remove?.id)
    await store.nextBranch()
    remove.close()
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>