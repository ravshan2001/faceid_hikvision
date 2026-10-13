<template>
  <div class="px-[25px] py-[18px] rounded-[13px] shadow-sm bg-hover space-y-4">
    <div class="flex justify-between items-center w-full">
      <div class="text-[#817295] text-[24px] w-[60%]">
        <div class="text-[13px]">{{ lastEvent?.door?.branch?.title }}</div>
        <div class="text-xl">{{ lastEvent?.user?.fullName }}</div>
        <span class=" border border-aside rounded-[13px] px-2 py-1 text-mainText text-[14px]">
          {{ lastEvent?.user?.department?.name }}
        </span>
        <div class="w-full flex items-center justify-between gap-2 mt-4">
          <div class="flex items-center gap-2 cursor-pointer" @click="openLightbox(lastEvent?.pictureURL)">
            <div>
              <ArrowRightEndOnRectangleIcon
                v-if="lastEvent?.action === 'enter'" 
                class="size-6 text-greenColor" 
              />
              <ArrowRightStartOnRectangleIcon 
                v-else
                class="size-6 text-redColor" 
              />
            </div>
            <div>
              <!-- {{ lastEvent }} -->
              <div 
                class="text-[16px]"
                :class="lastEvent?.action === 'exit' ? 'text-redColor' : lastEvent?.action === 'enter' ? 'text-greenColor' : ''" 
                >{{ getDoorTypeName(lastEvent?.action, $i18n.locale) || '' }}
              </div>
              <div class="text-sm">{{ lastEvent?.door?.title }}</div>
            </div>
          </div>
          <div class="text-[16px]">
            <div>{{ convertDateShort(lastEvent?.time,)}}</div>
            <div>{{ convertDateShort(lastEvent?.time, 'hour-second')}}</div>
          </div>
        </div>
      </div>
      <div>
        <img 
          v-if="lastEvent?.pictureURL"
          :src="`${url}/${lastEvent?.user?.faceUrl}`" 
          class="object-cover aspect-[3/2] w-24 h-32 cursor-pointer rounded-[13px] "
          @click="openFaceBox(lastEvent?.user?.faceUrl)" 
          alt=""
        >
        <img 
          v-else
          src="@/assets/images/man-avatar.png" 
          class="object-contain w-24  size-full cursor-pointer rounded-[13px]"
          alt="Avataruserimage"
        >
      </div>
    </div>
  </div>
  <VueEasyLightbox
    :visible="visibleAvatar"
    :imgs="[currentAvatarImage]"
    @hide="closeFaceBox"
  />
  <VueEasyLightbox
    :visible="visible"
    :imgs="[currentImage]"
    @hide="closeLightbox"
  />
</template>
<script setup>
import { computed, ref, watchEffect, defineProps } from 'vue'
const props = defineProps(['lastEvent'])
import { url } from '@/helpers/api'
import VueEasyLightbox from 'vue-easy-lightbox';
import { ArrowRightEndOnRectangleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline'
import { typeDoor } from '@/helpers/object'
import { convertDateShort } from '@/helpers/func';


const visible = ref(false);
const currentImage = ref('');
const visibleAvatar = ref(false);
const currentAvatarImage = ref('');

const openFaceBox = (imageUrl) => {
  currentAvatarImage.value = `${url}/${imageUrl}`;
  visibleAvatar.value = true;
};
// Lightboxni yopish funksiyasi
const closeFaceBox = () => {
  visibleAvatar.value = false;
  currentAvatarImage.value = '';
};

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

// Eshikni turini olamiz
const getDoorTypeName = (typeId, locale) => {
  const doorType = typeDoor.find((type) => type._id === typeId);
  return doorType ? doorType.name[locale] : '';
};

</script>