<template>
  <TransitionRoot as="template" :show="remove.show">
    <Dialog as="div" :class="`relative z-50 ${currentTheme}`" @close="remove_store.close()">
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
            >
              <div class="absolute right-0 top-0 pr-4 pt-4 block sm:hidden">
                <button
                  type="button"
                  :class="['rounded-md focus:outline-none text-mainText']"
                  @click="remove_store.close()"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="size-6" aria-hidden="true" />
                </button>
              </div>
              <div class="text-center flex flex-col items-center py-4 px-6">
                <div
                  :class="[
                    'rounded-full mb-1 w-14 h-14 flex items-center justify-center bg-blur',
                  ]"
                >
                  <ExclamationCircleIcon class="size-8 text-red-600" />
                </div>
                <div :class="['font-medium text-lg text-changeText']">
                  {{ deleteConfirmationMessage[locale] }}
                </div>
                <div :class="['text-base text-changeText']">
                  {{ dataDeletionMessage[locale] }}
                </div>
              </div>

              <div :class="['flex flex-row gap-3 border-t-[1px] py-4 px-6 border-border']">
                <button type="button" class="flex-1 cancelBtn font-medium text-sm" @click="remove_store.close()">
                  {{ $t('cancel') }}
                </button>

                <button
                  type="button"
                  class="inline-flex flex-1 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-whiteText shadow-sm hover:bg-red-600 w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                  @click="removeItem()"
                >
                  {{ deleteMessage[locale] }}
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

import { removeStore } from '@/stores/helpers/remove'
const remove_store = removeStore()
const { remove } = storeToRefs(remove_store)

const emit = defineEmits(['remove'])
const removeItem = () => {
  emit('remove')
}

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const deleteConfirmationMessage = {
  en: 'Delete this information?',
  ru: 'Удалить эту информацию?',
  uz: 'Ushbu ma’lumotni o‘chirasizmi?',
  kr: 'Ушбу маълумотни ўчирасизми?',
}

const dataDeletionMessage = {
  en: 'The data will be deleted and cannot be restored.',
  ru: 'Данные будут удалены и не подлежат восстановлению.',
  uz: 'Ma’lumotlar o‘chirib tashlanadi va qayta tiklab bo‘lmaydi.',
  kr: 'Маълумотлар ўчириб ташланади ва қайта тиклаб бўлмайди.',
}

const deleteMessage = {
  en: 'Delete',
  ru: 'Удалить',
  uz: 'O‘chirish',
  kr: 'Ўчириш',
}
</script>
