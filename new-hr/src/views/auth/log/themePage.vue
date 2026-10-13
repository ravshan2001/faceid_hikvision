<template>
  <div :class="[`absolute top-[5%] right-[5%] bg-transparent`]">
    <div class="flex items-center gap-4">
      <langPicker />
      <themePicker />
    </div>
  </div>
</template>

<script setup>
import langPicker from '@/assets/helpers/others/langPicker.vue'
import themePicker from '@/assets/helpers/others/themePicker.vue'
</script>
