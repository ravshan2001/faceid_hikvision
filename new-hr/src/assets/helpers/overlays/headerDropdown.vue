<template>
  <Menu as="div" class="relative inline-block">
    <div>
      <MenuButton :class="['flex items-center gap-1 cursor-pointer']">
        <div class=" text-mainText rounded-full overflow-hidden">
          <!-- <img
            v-if="user.faceUrl"
            :src="`${url}/${user.faceUrl}`"
            alt=""
            class="w-full h-full object-cover pointer-events-none"
          /> -->

          <UserCircleIcon class="w-10 object-cover pointer-events-none" />
        </div>
        <h1 class="text-mainText font-bold sm:hidden">
          {{ user.fullName?.length > 0 ? user.fullName : 'Admin' }}
        </h1>
        <ChevronDownIcon class="w-5 h-5 text-mainText sm:hidden" aria-hidden="true" />
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
          'absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md ring-1 shadow-lg ring-black/5 focus:outline-hidden bg-modal',
        ]"
      >
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-hover' : 'outline-hidden',
                'flex items-center gap-1 px-4 py-2 text-sm font-medium text-mainText w-full',
              ]"
              @click="logout.setShow(true)"
            >
              <PowerIcon class="w-5 h-5" />
              {{ title[locale] }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { GlobeAsiaAustraliaIcon, PowerIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { url } from '@/helpers/api'

import { storeToRefs } from 'pinia'

import { authStore } from '@/stores/admin/auth'
const store = authStore()
const { user } = storeToRefs(store)

import { logoutStore } from '@/stores/helpers/logout'
const logout = logoutStore()

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const title = {
  en: 'Log out',
  ru: 'Выйти',
  uz: 'Chiqish',
  kr: 'Чиқиш',
}
</script>
