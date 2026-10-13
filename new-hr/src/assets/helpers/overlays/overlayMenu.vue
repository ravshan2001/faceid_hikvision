<template>
  <div
    :class="[
      currentTheme,
      'hidden xl:block',
      'fixed h-[calc(100%-60px)] top-[60px] w-screen',
      'transform transition duration-200',
      show ? 'translate-y-0 z-40' : '-translate-y-[calc(100%+60px)] z-40',
    ]"
  >
    <div
      :class="[
        'transform transition-all duration-500 ease-in-out h-full bg-overlayBg',
        show ? 'max-h-full opacity-100' : 'max-h-0 opacity-0',
      ]"
    >
      <div class="p-5 h-full">
        <div class="h-full flex flex-col gap-4 sm:gap-4">
          <div class="hidden sm:flex items-center justify-end">
            <div class="hidden sm:flex items-center gap-4">
              <langPicker />
              <themePicker />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <nav
              v-for="item in mainMenu"
              :key="item.to"
              :class="[
                'py-1.5 px-2 rounded-md font-medium cursor-pointer sm:flex-1 sm:text-center',
                item.to == current ? 'bg-aside text-whiteText' : 'bg-main text-mainText',
              ]"
              @click="current = item.to"
            >
              {{ item.name[locale] }}
            </nav>
          </div>
          <div class="bg-linkbg p-4 rounded-xl h-full overflow-y-auto flex-1">
            <nav
              class="flex gap-5 flex-wrap sm:flex-col items-start flex-1 pb-5 overflow-y-auto sm:gap-3"
            >
              <router-link
                v-for="item of linkMenu?.filter((item) => item?.group == current)"
                :key="item.to"
                :to="{ name: item.to }"
                @click="overlay.setShow(false)"
                :class="[
                  'flex items-center gap-1.5 text-lg font-semibold hover:text-linkHover sm:text-xl',
                  route.name == item.to ? 'text-linkHover' : 'text-changeText',
                ]"
              >
                {{ item?.name[locale] }}
              </router-link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import langPicker from '../others/langPicker.vue'
import themePicker from '../others/themePicker.vue'
import { mainMenu, linkMenu } from '@/router/nav/overlay'

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const current = ref('main')

watch(
  () => route.name,
  () => {
    const found = mainMenu.find((item) =>
      linkMenu.some((l) => l.group === item.to && l.to == route.name),
    )
    if (found) {
      current.value = found.to;
    } else {
      console.warn('No matching menu item found for route:', route.name);
      current.value = 'main'; // Default qiymat
    }
  },
  { immediate: true },
)

import { storeToRefs } from 'pinia'

import { overlayStore } from '@/stores/helpers/overlayMenu'
const overlay = overlayStore()
const { show } = storeToRefs(overlay)

import { themeStore } from '@/stores/theme/theme'
const mode = themeStore()
const { currentTheme } = storeToRefs(mode)

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
</script>
