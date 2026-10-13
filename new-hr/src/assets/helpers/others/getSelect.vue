<template>
  <div class="relative">
    <select
      name="limit"
      id="limit"
      v-model="model"
      @change="$emit('updateType', model)"
      :class="[
        'w-full px-2 py-1.5 pr-5 rounded-md bg-transparent outline-none',
        'text-mainText text-base font-medium',
        'ring-1 focus:ring-offset-[1.5px]',
        'placeholder:text-placeholder',
        'ring-border focus:ring-offset-hoverAside',
      ]"
    >
      <!-- <option
        :value="0"
        class="bg-main text-changeText"
        :hidden="model == 0"
        :disabled="model == 0"
      >
        {{ name[locale] }}
      </option> -->
      <option value="" disabled selected>{{ placeholder || 'Выберите из списка' }}</option>
      <option
        v-for="item of array"
        :key="item._id"
        :value="item._id"
        :class="['bg-main text-changeText']"
      >
        {{ item[option_title] }}
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
  option_title: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
  },
})

const emit = defineEmits(['updateType'])
// const updateType = () => {
//   emit('updateType', model)
// }

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
</script>
