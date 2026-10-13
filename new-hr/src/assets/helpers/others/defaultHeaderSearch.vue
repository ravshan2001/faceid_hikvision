<template>
  <div class="flex-1 flex items-center h-full md:hidden relative" id="search">
    <label for="search">
      <MagnifyingGlassIcon class="w-6 h-6 text-placeholder sm:w-5 sm:h-5" />
    </label>
    <input
      type="text"
      id="search"
      class="flex-1 h-full px-2 pr-14 outline-none text-lg bg-transparent text-mainText placeholder:text-placeholder font-medium placeholder:text-base"
      :placeholder="`${$t('search')}...`"
      autocomplete="off"
      v-model="model"
      ref="searchInput"
      @keypress.enter="searchEvent"
    />
    <button
      v-if="model?.length > 0"
      class="bg-btn py-1.5 px-2 absolute right-1 transform -translate-y-1/2 top-1/2 rounded-md hover:bg-btnHover"
      @click="searchEvent"
    >
      <MagnifyingGlassIcon class="w-5 h-4 text-whiteText" />
    </button>
  </div>
</template>
<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
const searchInput = ref()
const model = defineModel()

const emit = defineEmits(['searchEvent'])
const searchEvent = () => {
  emit('searchEvent')
}

const handleClickOutside = (event) => {
  if (!event.target.closest('#search')) {
    model.value = ''
  }
}

const handleKeyPress = () => {
  if (event.ctrlKey && event.code === 'KeyK') {
    event.preventDefault()
    searchInput.value.focus()
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
