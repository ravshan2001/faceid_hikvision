<template>
  <div class="px-[25px] pt-[18px] pb-[10px] rounded-[13px] shadow-sm bg-hover space-y-4">
    <table class="table">
      <thead class="">
        <tr>
          <th class="th-first">№</th>
          <th class="th">{{ $t('photo') }}</th>
          <th class="th">{{ $t('fullName') }}</th>
          <th class="th">{{ $t('department') }}</th>
          <!-- <th class="th">{{ $t('role') }}</th> -->
          <th class="th text-center">Филиал</th>
          <th class="th text-center">{{ $t('door') }}</th>
          <th class="th">{{ $t('date') }}</th>
          <th class="th-last"></th>
          <!-- <th class="th-last"></th> -->
        </tr>
      </thead>
      <!-- <pre>{{ lastEvents }}</pre> -->
      <tbody v-if="lastEvents?.length > 0">
        <tr
          v-for="(item, index) of lastEvents"
          :key="item?._id"
          :class="[index % 2 !== 0 ? 'bg-index2' : '', 'hover:bg-hover']"
        >
          <td class="td-first">{{ index + 1 }}</td>
          <td class="td-img">
            <div class="overflow-hidden">
                <img
                  v-if="item?.user?.faceUrl?.length > 0"
                  :src="`${url}/${item?.user?.faceUrl}`"
                  alt=""
                  class="object-cover aspect-[3/2] w-12 h-16 cursor-pointer"
                  @click="openFaceBox(item?.user?.faceUrl)"
                />
                <UserIcon v-else :class="['object-contain size-full text-placeholder']" />
            </div>
          </td>
          <td class="td cursor-pointer" @click="$router.push({ name: 'worker-events', params: { id: item?.user?._id } })">{{ item?.user?.fullName || '' }}</td>
          <td class="td">{{ item?.user?.department?.name || '' }}</td>
          <!-- <td class="td">{{ getRoleName(item.user?.role, $i18n.locale) || '' }}</td> -->
          <td class="td text-center">
            {{ item?.door?.branch?.title || '' }}
          </td>
          <td class="td text-center">
            <div>
              <div>{{ item?.door?.title || '' }}</div>
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
          <td class="td-last">
            <div class="overflow-hidden">
                <img
                  v-if="item?.pictureURL"
                  :src="`${url}/${item?.pictureURL}`"
                  alt="image pictureurl"
                  class="object-cover aspect-[3/2] w-16 h-12 cursor-pointer"
                  @click="openLightbox(item?.pictureURL)"
                />
                <img
                  v-else
                  src="@/assets/images/image-not-found.png"
                  alt="image pictureurl"
                  class="object-contain size-full cursor-pointer"
                  @click="openLightbox(item?.pictureURL)"
                />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="lastEvents?.length == 0" class="text-center th">Пока нет записей.</div>
  </div>
  <VueEasyLightbox
    :visible="visible"
    :imgs="[currentImage]"
    @hide="closeLightbox"
  />
  <VueEasyLightbox
    :visible="visibleAvatar"
    :imgs="[currentAvatarImage]"
    @hide="closeFaceBox"
  />
</template>
<script setup>
import { computed, ref, watchEffect, defineProps } from 'vue'
const props = defineProps(['lastEvents'])
import { url } from '@/helpers/api'
import VueEasyLightbox from 'vue-easy-lightbox';
import { UserIcon } from '@heroicons/vue/24/outline'
import { typeDoor } from '@/helpers/object'
import { role } from '@/helpers/object';
import { convertDateShort } from '@/helpers/func';

// Lightbox holati
const visible = ref(false);
const currentImage = ref('');
const visibleAvatar = ref(false);
const currentAvatarImage = ref('');

// Lightboxni ochish funksiyasi
const openLightbox = (imageUrl) => {
  currentImage.value = `${url}/${imageUrl}`;
  visible.value = true;
};

// Lightboxni yopish funksiyasi
const closeLightbox = () => {
  visible.value = false;
  currentImage.value = '';
};

const openFaceBox = (imageUrl) => {
  currentAvatarImage.value = `${url}/${imageUrl}`;
  visibleAvatar.value = true;
};

// Lightboxni yopish funksiyasi
const closeFaceBox = () => {
  visibleAvatar.value = false;
  currentAvatarImage.value = '';
};



// Eshikni turini olamiz
const getDoorTypeName = (typeId, locale) => {
  const doorType = typeDoor.find((type) => type._id === typeId);
  return doorType ? doorType.name[locale] : '';
};


// Ishchi rollarini oalmzi
const getRoleName = (roleId, locale) => {
  const roleItem = role.find((role) => role._id === roleId);
  return roleItem ? roleItem.name[locale] : '';
};


import { loadingStore } from '@/stores/helpers/loading'
const loading = loadingStore()

</script>