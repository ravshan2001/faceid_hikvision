<template>
  <div class="relative">
    <select
      name="limit"
      id="limit"
      v-model="model"
      @change="updateLimit"
      :class="[
        'w-full px-2 py-1.5 pr-10 rounded-md bg-transparent outline-none',
        'text-mainText text-base font-medium',
        'ring-1 focus:ring-offset-[1.5px]',
        'placeholder:text-placeholder',
        'ring-border focus:ring-offset-hoverAside',
      ]"
    >
      <option
        v-for="item of array"
        :key="item._id"
        :value="item._id"
        :class="['bg-main text-changeText']"
        :hidden="item._id == selectedLimit"
        :disabled="item._id == selectedLimit"
      >
        <span v-if="item._id == selectedLimit">{{ message[locale] }}</span> {{ item._id }}
      </option>
    </select>
  </div>
</template>
<script setup>
const model = defineModel()
defineProps({
  selectedLimit: {
    type: null,
    required: true,
  },
  array: {
    type: Array,
    required: true,
  },
  message: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updateLimit'])
const updateLimit = () => {
  emit('updateLimit')
}

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
</script>
