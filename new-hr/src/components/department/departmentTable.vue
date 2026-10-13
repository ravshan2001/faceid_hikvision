<template>
  <div class="parent" v-if="count > 0 && !loading.loading">
    <div class="child">
      <div class="tableDiv">
        <table class="table">
          <thead class="thead">
            <tr>
              <th class="th-first">№</th>
              <th class="th">{{ $t('name') }}</th>
              <!-- <th class="th">{{ $t('parent') }}</th> -->
              <th class="th">{{ $t('chief') }}</th>
              <th class="th">Количество</th>
              <th class="th">{{ $t('status') }}</th>
              <th class="th-last" v-if="['admin', 'boss'].includes(user?.role)"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) of department"
              :key="item._id"
              :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover']"
            >
              <td class="td-first">{{ (page - 1) * limit + index + 1 }}</td>
              <td class="td w-[40%] 2xl:w-fit">{{ item.name }}</td>
              <!-- <td class="td">{{ item.parent?.name || '' }}</td> -->
              <td class="td">{{ item.chief?.fullName || '' }}</td>
              <td class="td"><div>
                <button class="danger-tag mr-1">{{ item?.notCamed }}</button>  
                <span class="success-tag mr-1">{{ item?.camed }}</span>
                <span class="default-tag">{{ item?.users }}</span>
              </div></td>
              <td class="td">
                <checkboxPage 
                  :modelValue="item?.status == 'active'? true : false"
                  @update:modelValue="val => {
                    item.status = val ? 'active' : 'inactive'
                    store.statusDepartment(item._id)
                  }" 
                  :disabled="!['admin', 'boss'].includes(user?.role)" 
                />
              </td>
              <td class="td-last" v-if="['admin', 'boss'].includes(user?.role)">
                <dropdownPage
                  name="department"
                  :id="item._id"
                  :boolen="index >= (count > 10 ? count - 3 : count)"
                />
                <tableButton name="department" :id="item._id" />
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
import removePage from '@/assets/helpers/overlays/removePage.vue'
import nothingPage from '@/assets/helpers/others/nothingPage.vue'
import checkboxPage from '@/assets/helpers/others/checkboxPage.vue'
import dropdownPage from '@/assets/table/dropdownPage.vue'
import tableButton from '@/assets/table/tableButton.vue'

defineProps({
  department: {
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

import { departmentStore } from '@/stores/data/department'
const store = departmentStore()

import { removeStore } from '@/stores/helpers/remove'
const remove = removeStore()


import { authStore } from '@/stores/admin/auth'
const user_store = authStore()
const { user } = storeToRefs(user_store)

const removeItem = async () => {
  try {
    await store.removeDepartment(remove.remove?.id)
    await store.nextDepartment()
    remove.close()
  } catch (err) {
    console.warn('Error Remove Department', err)
  }
}
</script>
