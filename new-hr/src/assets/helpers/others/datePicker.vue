<template>
  <div class="relative space-y-1">
    <label :for="name" :class="['block text-sm font-medium text-changeText ml-1']">
      {{ label }}
      <span v-if="required" class="text-sm text-red-500 font-medium">*</span>
    </label>

    <input
      type="text"
      :id="name"
      v-model="model"
      @input="typeDate"
      autocomplete="off"
      :placeholder="placeholder"
      :class="[
        'w-full px-2 py-1.5 pr-10 rounded-md bg-transparent outline-none',
        'text-mainText text-base font-medium',
        'ring-1 focus:ring-offset-[1.5px]',
        'placeholder:text-placeholder',
        error
          ? 'ring-red-500 focus:ring-offset-red-500'
          : 'ring-border focus:ring-offset-hoverAside',
      ]"
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
  placeholder: {
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

import { ref, onMounted } from 'vue'

import flatpickr from 'flatpickr'
import('flatpickr/dist/flatpickr.min.css')
import { typeDate } from '@/helpers/func'

let fpInstance = ref(null)

const initFlatpickr = () => {
  if (fpInstance.value) {
    fpInstance.value.destroy()
  }

  fpInstance.value = flatpickr(`#${props.name}`, {
    dateFormat: 'd-m-Y',
    static: true,
    disableMobile: 'true',
    allowInput: true,
    // locale: locales[i18n.global.locale] || locales['uz'],
    onChange: (selectedDates) => {
      // console.log('FlatPickr', selectedDates)
      model.value = selectedDates
    },
  })
}

onMounted(() => {
  initFlatpickr()
})
</script>
