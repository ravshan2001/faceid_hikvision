<template>
  <main
    ref="mainRef"
    @scroll="handleScrollY"
    :class="[
      styles,
      `mainScroll flex flex-col`,
      'p-4 pb-2 sm:px-2 h-[calc(100%-60px)] transition-transfrom duration-300',
      show ? 'sm:-translate-y-[60px] sm:h-full' : 'sm:translate-y-0',
    ]"
  >
  
    <slot />
  </main>
</template>
<script setup>
defineProps({
  styles: {
    required: false,
    type: String,
  },
})
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

const mainRef = ref()
const scrollY = ref(0)
let lastScrollY = 0

const handleScrollY = () => {
  if (mainRef.value) {
    scrollY.value = mainRef.value.scrollTop
  }
}

import { headerShowStore } from '@/stores/helpers/headerShow'
const header_store = headerShowStore()
const { show } = storeToRefs(header_store)

// watch(scrollY, (newVal) => {
//   if (newVal > lastScrollY && newVal > 50) {
//     header_store.setShow(true)
//   } else {
//     header_store.setShow(false)
//   }
//   lastScrollY = newVal
// })
</script>
