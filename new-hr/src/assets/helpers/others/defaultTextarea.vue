<template>
  <div class="relative space-y-1">
    <label :for="name" :class="['block text-sm font-medium text-changeText ml-1']">
      {{ label }} 
      <span v-if="required" class="text-sm text-red-500 font-medium">*</span>
    </label>
    <div class="relative">
      <textarea
        :id="name"
        :rows="rows"
        :name="name"
        :placeholder="placeholder"
        v-model="model"
        :class="[
          'w-full px-2 py-1.5 pr-10 rounded-md bg-transparent outline-none',
          'text-mainText text-base font-medium',
          'ring-1 focus:ring-offset-[1.5px]',
          'placeholder:text-placeholder placeholder:text-sm',
          error
            ? 'ring-red-500 focus:ring-offset-red-500'
            : 'ring-border focus:ring-offset-hoverAside',
        ]"
      />
    </div>
  </div>
</template>
<script setup>
const model = defineModel()
defineProps(['label', 'placeholder', 'name', 'enter', 'error', 'required', 'disabled', 'rows'])
</script>
<style lang=""></style>