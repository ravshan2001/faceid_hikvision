<template>
  <div class="relative space-y-1 flex items-center">
    <div class="flex items-center gap-2">
      <input
        type="checkbox"
        v-model="model"
        :name="name"
        :id="name"
        :disabled="disabled"
        class="w-4 h-4 rounded cursor-pointer text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <label :for="name" class="block text-sm font-medium text-changeText cursor-pointer">
        {{ label }}
        <span v-if="required" class="text-sm text-red-500 font-medium">*</span>
      </label>
    </div>

    <span
      v-if="guide"
      :class="[
        'absolute transform text-sm text-red-500',
        'left-1',
        error
          ? 'transition duration-100 -translate-y-1'
          : 'opacity-0 -translate-y-7 pointer-events-none',
      ]"
    >
      {{ guide }}
    </span>
  </div>
</template>

<script setup>
const model = defineModel()
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  error: {
    type: Boolean,
    required: false,
  },
  guide: {
    type: String,
    required: false,
  },
  required: {
    type: Boolean,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
})
</script>