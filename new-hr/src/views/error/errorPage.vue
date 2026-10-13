<template>
  <div :class="[currentTheme, 'h-screen w-screen p-5 flex items-center justify-center bg-modal']">
    <div class="flex flex-col items-center gap-5 sm:gap-3">
      <p :class="['text-9xl font-bold sm:text-7xl text-changeText']">404</p>
      <h1 :class="['text-3xl font-bold tracking-tight sm:text-2xl text-changeText']">
        {{ title[locale] }}
      </h1>
      <p :class="['text-base leading-7 sm:text-sm text-mainText']">
        {{ text[locale] }}
      </p>
      <div class="flex items-center justify-center gap-x-6">
        <button
          @click="goBack"
          class="bg-aside rounded-lg px-3.5 py-2.5 text-sm font-semibold text-whiteText shadow-sm hover:bg-hoverAside focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hoverAside"
        >
          {{ back[locale] }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { themeStore } from '@/stores/theme/theme'
const mode = themeStore()
const { currentTheme } = storeToRefs(mode)

import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => {
  router.back()
}

const title = {
  en: 'Something went wrong!!',
  ru: 'Что-то пошло не так!!',
  uz: 'Nimadir xato ketdi!!',
  kr: 'Нимадир хато кетди!!',
}

const text = {
  en: "It seems you shouldn't have entered here.",
  ru: 'Похоже, вам не следовало сюда заходить.',
  uz: 'Siz bu yerga kirmasligingiz kerak edi, shekilli.',
  kr: 'Сиз бу ерга кирмаслигингиз керак эди, шекилли.',
}

const back = {
  en: 'Back',
  ru: 'Назад',
  uz: 'Orqaga',
  kr: 'Орқага',
}

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
</script>
