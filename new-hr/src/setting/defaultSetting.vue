<template>
  <div class="h-[calc(100%-60px)] p-4 pb-2 flex flex-col overflow-hidden">
    <div class="flex flex-col flex-1 overflow-hidden items-start gap-4 sm:block h-[100px]">
      <indexSetting />

      <div class="flex flex-col  overflow-hidden w-full">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup>
import indexSetting from './indexSetting.vue'
</script>
