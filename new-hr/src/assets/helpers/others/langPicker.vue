<template>
  <Menu as="div" class="relative inline-block">
    <div>
      <MenuButton
        :class="['flex items-center justify-center cursor-pointer h-full', 'text-mainText']"
        v-for="item of language?.filter((item) => item?.id === locale)"
        :key="item.id"
      >
        <div :class="['flex-1 mr-1 overflow-hidden w-[44px] h-10']">
          <img :src="item.icon" alt="" class="w-full h-full object-contain" />
        </div>
        <p class="font-bold hidden">
          {{ item.name || '' }}
        </p>
        <ChevronDownIcon class="size-5 ml-1 hidden" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        :class="[
          'absolute right-0 z-10 mt-1 w-fit origin-top-right rounded-md ring-1 shadow-lg ring-black/5 focus:outline-hidden bg-modal',
        ]"
      >
        <div class="py-1">
          <MenuItem
            v-slot="{ active }"
            v-for="item of language?.filter((item) => item?.id !== locale)"
            :key="item.id"
          >
            <button
              :class="[
                active ? 'bg-hover' : 'outline-hidden',
                'flex items-center gap-2 px-4 py-1.5  w-full text-mainText',
                'font-medium',
              ]"
              @click="language_store.setLang(item.id)"
            >
              <div class="w-7 h-7 overflow-hidden">
                <img :src="item.icon" alt="" class="w-full h-full object-contain" />
              </div>
              {{ item.name || '' }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

import { languageStore } from '@/i18n/locales/store/language'
import { storeToRefs } from 'pinia'
const language_store = languageStore()
const { language } = storeToRefs(language_store)
</script>
