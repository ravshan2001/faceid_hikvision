<template>
  <div class="relative">
    <select
      name="limit"
      id="limit"
      v-model="model"
      @change="updateType"
      :class="[
        'w-full px-2 py-1.5 pr-10 rounded-md bg-transparent outline-none',
        'text-mainText text-base font-medium',
        'ring-1 focus:ring-offset-[1.5px]',
        'placeholder:text-placeholder',
        'ring-border focus:ring-offset-hoverAside',
      ]"
    >
      <option
        value=""
        disabled 
        selected
      >
        {{ name[locale] }}
      </option>

      <option
        v-for="item of array"
        :key="item._id"
        :value="item._id"
        :class="['bg-main text-changeText']"
      >
        {{ item.name[locale] }}
      </option>
    </select>
  </div>
</template>
<script setup>
const model = defineModel()

defineProps({
  array: {
    type: Array,
    required: true,
  },
  selectedType: {
    type: null,
  },
  name: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updateType'])
const updateType = () => {
  emit('updateType')
}

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
</script>
