<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" :class="`relative z-50 ${currentTheme}`" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div :class="['fixed inset-0 transition-opacity bg-blur']" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              :class="[
                'relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all w-full max-w-[420px] sm:w-full bg-modal',
              ]"
              v-motion-slide-visible-once-bottom
            >
              <div class="absolute right-0 top-0 pr-4 pt-4 block sm:hidden">
                <button
                  type="button"
                  :class="['rounded-md focus:outline-none text-mainText']"
                  @click="close"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="size-6" aria-hidden="true" />
                </button>
              </div>
              <div class="text-center flex flex-col items-center py-4 px-6">
                <div
                  :class="[
                    'rounded-full mb-1 w-14 h-14 flex items-center justify-center bg-blur/20',
                  ]"
                >
                  <ExclamationCircleIcon class="size-8 text-red-600" />
                </div>
                <div :class="['font-medium text-lg text-changeText']">{{ title[locale] }}</div>
                <div :class="['text-base text-changeText']">{{ text[locale] }}</div>
              </div>

              <div :class="['flex flex-row gap-3 border-t-[1px] py-4 px-6 border-border']">
                <button type="button" class="flex-1 cancelBtn font-medium text-sm" @click="close">
                  {{ $t('cancel') }}
                </button>

                <button
                  type="button"
                  class="inline-flex flex-1 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-whiteText shadow-sm hover:bg-red-500 w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                  @click="logout()"
                >
                  {{ send[locale] }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'

import { storeToRefs } from 'pinia'

import { themeStore } from '@/stores/theme/theme'
const mode = themeStore()
const { currentTheme } = storeToRefs(mode)

import { logoutStore } from '@/stores/helpers/logout'
const logout_store = logoutStore()
const { show } = storeToRefs(logout_store)

const close = () => {
  logout_store.setShow(false)
}

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()

const logout = () => {
  logout_store.setShow(false)
  auth_store.logout()
}

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const title = {
  en: 'Warning!',
  ru: 'Предупреждение!',
  uz: 'Ogohlantirish!',
  kr: 'Огоҳлантириш!',
}

const text = {
  en: 'Do you want to leave the site?',
  ru: 'Вы хотите покинуть сайт?',
  uz: 'Saytdan chiqishni xohlaysizmi?',
  kr: 'Сайтдан чиқишни хоҳлайсизми?',
}

const send = {
  en: 'Continue',
  ru: 'Продолжить',
  uz: 'Davom etish',
  kr: 'Давом этиш',
}
</script>
