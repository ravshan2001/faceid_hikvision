<template>
  <div :class="['flex items-center justify-between', 'mb-3']">
    <div class="relative flex items-center gap-2">
      <button v-if="backLink" @click="router.push({ name: backLink })">
        <ChevronLeftIcon
          class="w-[30px] h-[30px] mr-4 rounded-md bg-btn flex justify-center items-center text-whiteText hover:bg-btnHover"
        />
      </button>
      <h1 class="text-2xl font-bold text-mainText select-none">
        {{ title || route?.meta?.title[locale] || '' }}
      </h1>
      <span class="bg-hover px-2 rounded-[13px] text-mainText text-sm whitespace-nowrap">{{ count }}</span>
    </div>

    <div class="flex items-center gap-2">
      <div class="sm:hidden flex items-center gap-3">
        <slot />
      </div>
      <button
        v-if="newToggleBtn"
        type="button"
        @click="modal.setModal(true, name, id, lang)"
        class="py-2 px-2 text-center text-base font-medium bg-btn rounded-md text-whiteText hover:bg-btnHover flex items-center gap-1"
      >
        <PlusIcon class="w-5 h-5" />
        <!-- {{ $t('new') }} -->
      </button>
    </div>
  </div>
</template>
<script setup>
import { PlusIcon, ChevronLeftIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  id: {
    type: String,
    required: false,
  },
  lang: {
    type: String,
    required: false,
  },
  backLink: {
    type: String,
  },
  newToggleBtn: {
    type: Boolean,
    required: false,
  },
  count: {
    type: Number,
  },
})
import { modalStore } from '@/stores/helpers/modal'
const modal = modalStore()

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted } from 'vue'
const { locale } = useI18n()

// Klaviatura bosilganda ishlovchi funksiya
const handleKeyPress = (event) => {
  if (event.ctrlKey && event.code === 'Space') {
    modal.setModal(true, props?.name, props?.id, props?.lang)
  }
}

// Hodisani qo'shish va olib tashlash
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>
