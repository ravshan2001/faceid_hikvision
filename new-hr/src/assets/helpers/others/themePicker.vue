<template>
  <div class="relative">
    <input type="checkbox" id="darkmode-toggle" v-model="isDark" class="hidden" @change="toggleTheme" />
    <label for="darkmode-toggle" class="theme-label">
      <SunIcon class="w-4 h-4 sun" />
      <MoonIcon class="w-4 h-4 moon" />
    </label>
    <div class="background"></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { themeStore } from '@/stores/theme/theme'
import { storeToRefs } from 'pinia'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/solid'

const mode = themeStore()
const { currentTheme } = storeToRefs(mode)

const isDark = ref(currentTheme.value === 'dark')

// Sync Pinia → toggle checkbox when currentTheme changes externally
watch(currentTheme, (newVal) => {
  isDark.value = newVal === 'dark'
})

function toggleTheme() {
  mode.updateTheme(isDark.value ? 'dark' : 'light')
}
</script>











<!-- <template>
  <div class="rounded-md w-8 h-8">
    <Menu as="div" class="relative inline-block">
      <div>
        <MenuButton
          v-for="item of theme?.filter((item) => item?.id === currentTheme)"
          :key="item?.id"
        >
          <SwatchIcon class="w-full h-full text-mainText" />
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
            'absolute -right-1 z-10 w-fit origin-top-right rounded-md ring-1 shadow-lg ring-black/5 focus:outline-hidden bg-modal',
          ]"
        >
          <div class="py-1 flex flex-col gap-1">
            <MenuItem
              v-slot="{ active }"
              v-for="item of theme?.filter((item) => item?.id !== currentTheme)"
              :key="item?.id"
            >
              <button
                :class="[
                  active ? 'bg-hover' : 'outline-hidden',
                  'p-2 text-whiteText flex items-center w-[80px]',
                ]"
                @click="mode.updateTheme(item?.id)"
              >
                <span class="text-mainText font-medium">
                  {{ item.id == 'light' ? 'Light' : '' }}
                  {{ item.id == 'dark' ? 'Dark' : '' }}
                  {{ item.id == 'blue' ? 'Blue' : '' }}
                </span>
                <span
                  :class="[
                    'w-5 h-5 rounded-full ml-auto',
                    item.id == 'dark' ? 'dark bg-aside' : '',
                    item.id == 'blue' ? 'blue bg-aside' : '',
                    item.id == 'light' ? 'light bg-aside' : '',
                  ]"
                />
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { SwatchIcon, CheckIcon } from '@heroicons/vue/24/outline'

import { storeToRefs } from 'pinia'

import { themeStore } from '@/stores/theme/theme'
const mode = themeStore()
const { currentTheme, theme } = storeToRefs(mode)
</script> -->
