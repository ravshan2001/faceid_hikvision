<template>
  <TransitionRoot as="template" :show="modal.show">
    <Dialog as="div" :class="[`${currentTheme} relative z-50`]" @close="store.close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 transition-opacity bg-blur" />
      </TransitionChild>

      <div class="fixed inset-0 z-10">
        <div class="flex h-screen justify-center text-center items-center sm:items-start p-4">
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
                'relative transform rounded-lg px-4 py-5 text-left shadow-xl transition-all w-full max-w-2xl bg-modal',
                'h-fit max-h-[80%] overflow-y-auto mainScroll',
              ]"
              v-motion-slide-visible-once-bottom
            >
              <div class="absolute right-0 top-0 pr-4 pt-4 block">
                <button
                  type="button"
                  :class="['rounded-md focus:outline-none text-mainText']"
                  @click="store.close"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="size-6" aria-hidden="true" />
                </button>
              </div>

              <DialogTitle
                as="h3"
                class="text-changeText text-2xl font-bold leading-normal mb-4 min-h-[36px] sm:min-h-[30px]"
              >
                {{ modal.title || '' }}
              </DialogTitle>

              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
defineProps(['data'])
import { Dialog, TransitionChild, TransitionRoot, DialogPanel, DialogTitle } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

import { storeToRefs } from 'pinia'

import { modalStore } from '@/stores/helpers/modal'
const store = modalStore()
const { modal } = storeToRefs(store)

import { themeStore } from '@/stores/theme/theme'
const mode = themeStore()
const { currentTheme } = storeToRefs(mode)
</script>
