<template>
  <div class="relative">
    <label :for="name" :class="['block text-sm font-medium text-changeText ml-1']">
      {{ label }}
      <span v-if="required" class="text-sm text-red-500 font-medium">*</span>
    </label>

    <textarea
      :name="name"
      :id="name"
      :placeholder="placeholder"
      :disabled="disabled"
      autocomplete="off"
      v-model="model"
      :class="[
        'w-full px-2 py-1.5 pr-10 rounded-md bg-transparent outline-none',
        'text-mainText text-base font-medium',
        'ring-1 focus:ring-offset-[1.5px]',
        'placeholder:text-placeholder placeholder:text-sm',
        'resize-none block w-full mt-1',
        error
          ? 'ring-red-500 focus:ring-offset-red-500'
          : 'ring-border focus:ring-offset-hoverAside',
      ]"
      rows="2"
    />

    <span
      :class="[
        'absolute transform text-sm text-red-500',
        'left-1 ',
        error ? 'transition duration-100 -translate-y-1' : 'opacity-0 -translate-y-2',
      ]"
    >
      {{ guide }}
    </span>
  </div>
</template>
<script setup>
const model = defineModel()
defineProps({
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
  placeholder: {
    type: String,
    required: false,
  },
  maska: {
    type: Boolean,
    required: false,
  },
  focus: {
    type: Boolean,
    required: false,
  },
  required: {
    type: Boolean,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  password: {
    type: Boolean,
    required: false,
  },
})
</script>
