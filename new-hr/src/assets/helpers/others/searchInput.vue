<template>
  <div :class="['relative', route.name == 'door' ? '' : 'sm:col-span-2']" id="search">
    <input
      ref="searchInput"
      type="search"
      v-model="model"
      class="searchInput"
      :placeholder="`${$t('search')}... (Alt X)`"
      @keypress.enter="searchEvent"
    />

    <button
      class="bg-btn py-1.5 px-2 absolute right-1 transform -translate-y-1/2 top-1/2 rounded-md hover:bg-btnHover"
      @click="searchEvent"
    >
      <MagnifyingGlassIcon class="w-5 h-4 text-whiteText" />
    </button>
  </div>
</template>
<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
const model = defineModel()

import { useRoute } from 'vue-router'
const route = useRoute()

const emit = defineEmits(['searchEvent'])

const searchEvent = () => {
  emit('searchEvent')
}

import { onMounted, onUnmounted, ref, onBeforeUnmount } from 'vue'

const searchInput = ref()

const handleKeyPress = (event) => {
  if (event.altKey && event.code === 'KeyX') {
    searchInput.value.focus()
  }
}

const handleClickOutside = (event) => {
  if (!event.target.closest('#search')) {
    model.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>
