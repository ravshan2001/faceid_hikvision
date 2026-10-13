<template>
  <div
    :class="[
      currentTheme,
      'absolute inset-0 mx-auto flex items-center justify-center z-[99999] bg-blur',
    ]"
    v-if="loading"
  >
    <div class="flex justify-center items-center py-4 z-50">
      <div
        class="animate-spin border-l-aside size-7 rounded-full border-4 border-dotted border-placeholder"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

import { loadingStore } from '@/stores/helpers/loading'
const loading_store = loadingStore()
const { loading } = storeToRefs(loading_store)

import { themeStore } from '@/stores/theme/theme'
const mode = themeStore()
const { currentTheme } = storeToRefs(mode)
</script>
