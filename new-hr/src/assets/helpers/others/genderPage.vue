<template>
  <div class="relative space-y-1">
    <label :class="['block text-sm font-medium text-changeText ml-1']">
      {{ label }}
      <span class="text-sm text-red-500 font-medium" v-if="required">*</span>
    </label>

    <div class="grid grid-cols-2 gap-4">
      <label
        v-for="opt in option"
        :key="opt._id"
        :for="opt._id"
        :class="[
          'w-full px-2 py-1.5 rounded-md bg-transparent outline-none',
          'text-mainText text-base font-medium',
          'ring-1 focus:ring-offset-[1.5px]',
          'placeholder:text-placeholder',
          'flex items-center gap-2 cursor-pointer',
          error
            ? 'ring-red-500 focus:ring-offset-red-500'
            : 'ring-border focus:ring-offset-hoverAside',
          opt.disabled ? 'cursor-not-allowed' : '',
        ]"
      >
        <span
          :class="[
            'w-[25px] h-[25px] rounded-full border-[7px] sm:w-5 sm:h-5',
            opt._id == model ? 'border-btn' : 'border-placeholder',
          ]"
        />

        <p class="flex-1">
          {{ opt[option_title]?.[i18n.global.locale] }}
        </p>

        <input
          :id="opt._id"
          :name="name"
          type="radio"
          :value="opt._id"
          v-model="model"
          class="hidden"
          :disabled="opt.disabled"
        />
      </label>
    </div>

    <span
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
import { i18n } from '@/i18n/i18n'
defineProps({
  label: {
    type: String,
    required: true,
  },
  option: {
    type: Array,
    required: true,
  },
  option_title: {
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
  required: {
    type: Boolean,
    default: false,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false,
  },
  guide: {
    type: String,
    required: false,
  },
})
const model = defineModel()
</script>
