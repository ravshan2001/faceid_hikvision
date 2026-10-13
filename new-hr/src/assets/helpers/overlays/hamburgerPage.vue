<template>
  <div class="hidden xl:block">
    <div
      :class="[
        show ? '-rotate-45' : '',
        'w-8 h-8 flex flex-col justify-between cursor-pointer transition-transform duration-[330ms] ease-out',
      ]"
      @click="store.setShow()"
    >
      <div
        :class="[
          show ? '-rotate-90 translate-x-0 -translate-y-[2px]' : '',
          'bg-changeText rounded-md w-1/2 h-1 transition-transform duration-[330ms] origin-right',
          '[transition-timing-function:cubic-bezier(0.54,-0.81,0.57,0.57)]',
        ]"
      />
      <div class="bg-changeText rounded-md w-full h-1" />
      <div
        :class="[
          show ? '-rotate-90 translate-x-0 translate-y-[2px]' : '',
          'bg-changeText w-1/2 rounded-md h-1 self-end transition-transform duration-[330ms] origin-left',
          '[transition-timing-function:cubic-bezier(0.54,-0.81,0.57,0.57)]',
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

import { overlayStore } from '@/stores/helpers/overlayMenu'
const store = overlayStore()
const { show } = storeToRefs(store)
</script>
