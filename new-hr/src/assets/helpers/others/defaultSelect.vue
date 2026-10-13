<template>
  <div class="relative space-y-1 h-[60px]">
    <label :for="name" :class="['block text-sm font-medium text-changeText ml-1']">
      {{ label }}
      <span v-if="required" class="text-sm text-red-500 font-medium">*</span>
    </label>

    <select
      ref="selectRef"
      :name="name"
      :id="name"
      v-model="model"
      :class="[
        'w-full px-2 py-1.5 pr-10 rounded-md bg-transparent outline-none',
        'text-mainText text-base font-medium',
        'ring-1 focus:ring-offset-[1.5px]',
        'placeholder:text-placeholder',
        error
          ? 'ring-red-500 focus:ring-offset-red-500'
          : 'ring-border focus:ring-offset-hoverAside',
      ]"
    >
      <option
        value=""
        :hidden="model?.length === 0"
        :disabled="model?.length === 0"
        class="text-sm bg-main text-mainText"
      />

      <option
        v-for="item of option"
        :key="item._id"
        :value="item._id"
        :class="['bg-main text-changeText']"
        :disabled="selectedValues.includes(item._id)"
        :hidden="selectedValues.includes(item._id)"
      >
        {{ translates ? item[title] : (item[title][locale] || item[title]) }}
      </option>
    </select>

    <div
      :class="[
        'absolute left-2 bottom-2 sm:bottom-2 text-placeholder cursor-default pointer-events-none -z-10 text-sm font-medium',
        model?.length === 0 ? 'opacity-100 transition duration-200' : 'opacity-0',
      ]"
    >
      {{ placeholder }}
    </div>

    <span
      :class="[
        'absolute transform text-sm text-red-500',
        'left-1',
        error
          ? 'translate-y-[34px] transition duration-100'
          : 'opacity-0 translate-y-5 pointer-events-none',
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
  disabled: {
    type: Boolean,
    required: false,
  },
  focus: {
    type: Boolean,
    required: false,
  },
  option: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
  },
  required: {
    type: Boolean,
    required: false,
  },
  guide: {
    type: String,
    required: false,
  },
  selectedItems: { type: Array, required: false, default: () => [] },
  translates: {
    type: Boolean,
    required: false,
  },
})

import { ref, watch, onMounted, computed } from 'vue'
const selectRef = ref()

// const selectedValues = computed(() => props.selectedItems.map((item) => item.day))
const selectedValues = computed(() => props.selectedItems.map((item) => item.day))

const focusSelect = () => {
  if (props.focus && selectRef.value) {
    selectRef.value.focus()
  }
}

watch(
  () => props.focus,
  (newVal) => {
    if (newVal && selectRef.value) {
      focusSelect()
    }
  },
)

onMounted(() => {
  focusSelect()
})

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
</script>
