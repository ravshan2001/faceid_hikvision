<template>
  <div v-if="count > 0 && !loading.loading" class="parent">
    <div class="child">
      <div class="tableDiv">
        <table class="table">
          <thead class="thead">
            <tr>
              <th class="th-first">№</th>
              <th class="th">{{ $t('photo') }}</th>
              <th class="th">{{ $t('fullName') }}</th>
              <th class="th text-center">Номер сотрудника</th>
              <th class="th">{{ $t('department') }}</th>
              <th class="th">{{ $t('role') }}</th>
              <th class="th">{{ $t('status') }}</th>
              <th class="th-last" v-if="['admin', 'boss'].includes(user?.role)"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) of workers"
              :key="item._id"
              class='cursor-pointer'
              :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover']"
              
            >
              <td class="td-first">{{ (page - 1) * limit + index + 1 }}</td>
              <td class="td-img">
                <div class="overflow-hidden">
                  <img
                    v-if="item.faceUrl?.length > 0"
                    :src="`${url}/${item.faceUrl}`"
                    alt=""
                    class="object-cover aspect-[3/2] w-12 h-16 cursor-pointer"
                    @click="openFaceBox(item?.faceUrl, $event)"
                  />
                  <UserIcon v-else :class="['w-full h-full object-contain text-placeholder']" />
                </div>
              </td>
              <td 
                class="td"
                @click="$router.push({ name: 'worker-events', params: { id: item?._id } })"
              >
                {{ item?.fullName || '' }}
              </td>
              <td 
                class="td text-center"
              >
                {{ item?.employeeNo || '' }}
              </td>
              <td class="td"
              @click="$router.push({ name: 'worker-events', params: { id: item?._id } })"
              >{{ item?.department?.name || '' }}</td>
              <td class="td"
              @click="$router.push({ name: 'worker-events', params: { id: item?._id } })"
              >{{ getRoleName(item?.role, $i18n.locale) || '' }}</td>
              <td class="td">
                <checkboxPage 
                  :modelValue="item.status === 'active'"
                  @update:modelValue="val => {
                    item.status = val ? 'active' : 'inactive'
                    store.statusUser(item?._id)
                  }" 
                  :disabled="!['admin', 'boss'].includes(user?.role)" 
                />
              </td>
              <td class="td-last" v-if="['admin', 'boss'].includes(user?.role)">
                <dropdownPage
                  name="workers"
                  :id="item._id"
                  :boolen="index >= (count > 8 ? count - 3 : count)"
                />
                <tableButton name="workers" :id="item?._id" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <VueEasyLightbox
    :visible="visibleAvatar"
    :imgs="[currentAvatarImage]"
    @hide="closeFaceBox"
  />
  <removePage @remove="removeItem()" />
  <nothingPage :visibility="count <= 0 && !loading.loading" />
</template>
<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import nothingPage from '@/assets/helpers/others/nothingPage.vue'
import checkboxPage from '@/assets/helpers/others/checkboxPage.vue'
import removePage from '@/assets/helpers/overlays/removePage.vue'
import { url } from '@/helpers/api'
import { UserIcon } from '@heroicons/vue/24/outline'
import dropdownPage from '@/assets/table/dropdownPage.vue'
import tableButton from '@/assets/table/tableButton.vue'
import VueEasyLightbox from 'vue-easy-lightbox';
import { role } from '@/helpers/object';

defineProps({
  workers: {
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

import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

import { userStore } from '@/stores/data/users'
const store = userStore()

import { removeStore } from '@/stores/helpers/remove'
const remove = removeStore()

const removeItem = async () => {
  try {
    await store.removeUser(remove.remove?.id)
    await store.nextUser()
    remove.close()
  } catch (err) {
    console.warn('Error Remove User', err)
  }
}

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)


// Lightbox holati
const visibleAvatar = ref(false);
const currentAvatarImage = ref('');

const openFaceBox = (imageUrl, event) => {
  event.stopPropagation();
  currentAvatarImage.value = `${url}/${imageUrl}`;
  visibleAvatar.value = true;
};

// Lightboxni yopish funksiyasi
const closeFaceBox = () => {
  visibleAvatar.value = false;
  currentAvatarImage.value = '';
};


// Ishchi rollarini oalmzi
const getRoleName = (roleId, locale) => {
  const roleItem = role.find((role) => role._id === roleId);
  return roleItem ? roleItem.name[locale] : '';
};

</script>
