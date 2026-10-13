<template>
  <div
    aria-live="assertive"
    :class="[
      `${currentTheme} bg-transparent pointer-events-none z-[9999] fixed inset-0 flex p-6 px-4 py-6 items-start sm:p-4`,
    ]"
  >
    <div class="flex w-full flex-col space-y-4 items-end">
      <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="notif.show"
          :class="[
            'pointer-events-auto relative flex items-start flex-col max-w-sm w-full overflow-hidden rounded-lg shadow-lg ring-1 ring-opacity-5 p-4 bg-modal ring-border break-words',
            notif.type == 'danger' ? 'bg-red-400 ring-red-500' : ''
          ]"
          v-motion-slide-visible-once-bottom
        >
          <div class="flex items-center gap-1">
            <ExclamationTriangleIcon v-if="notif.type == 'warning'" class="w-6 h-6 text-red-500" />
            <CheckBadgeIcon v-if="notif.type == 'success'" class="w-6 h-6 text-green-700" />
            <InformationCircleIcon v-if="notif.type == 'info'" class="w-6 h-6 text-sky-700" />
            <XCircleIcon v-if="notif.type == 'danger'" class="w-6 h-6 text-whiteText" />

            <div
              :class="[
                'font-medium',
                notif.type == 'danger' ? 'text-whiteText' : 'text-mainText',
                notif.type == 'warning' ? 'text-red-500' : 'text-mainText',
              ]"
            >
              {{ notif.type == 'danger' ? error[locale] : '' }}
              {{ notif.type == 'warning' ? warning[locale] : '' }}
              {{ notif.type == 'info' ? information[locale] : '' }}
              {{ notif.type == 'success' ? success[locale] : '' }}
            </div>
          </div>

          <div class="mt-1">
            <p
              :class="[
                'text-sm font-medium sm:text-xs',
                notif.type == 'danger' ? 'text-whiteText' : 'text-mainText',
              ]"
            >
              {{ notif.msg[locale] }}
            </p>
          </div>

          <button
            type="button"
            @click="notification.setNotif(false, '', 'success')"
            class="absolute right-4 top-4 inline-flex rounded-md focus:outline-none"
          >
            <span class="sr-only">Close</span>
            <XMarkIcon
              :class="['size-5', notif.type == 'danger' ? 'text-whiteText' : 'text-mainText']"
              aria-hidden="true"
            />
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid'
import {
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

import { storeToRefs } from 'pinia'

import { notifStore } from '@/stores/helpers/notification'
const notification = notifStore()
const { notif } = storeToRefs(notification)

import { themeStore } from '@/stores/theme/theme'
const mode = themeStore()
const { currentTheme } = storeToRefs(mode)

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const warning = {
  en: 'Warning',
  ru: 'Предупреждение',
  uz: 'Ogohlantirish',
  kr: 'Огоҳлантириш',
}

const information = {
  en: 'Information',
  ru: 'Информация',
  uz: 'Ma’lumot',
  kr: 'Маълумот',
}

const success = {
  en: 'Successfully',
  ru: 'Успешно',
  uz: 'Muvaffaqiyatli',
  kr: 'Муваффақиятли',
}

const error = {
  en: 'Error',
  ru: 'Ошибка',
  uz: 'Xatolik',
  kr: 'Хатолик',
}
</script>
