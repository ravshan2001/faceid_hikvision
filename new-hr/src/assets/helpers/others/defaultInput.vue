<template>
  <div class="relative space-y-1">
    <label :for="name" :class="['block text-sm font-medium text-changeText ml-1']">
      {{ label }}
      <span v-if="required" class="text-sm text-red-500 font-medium">*</span>
    </label>

    <div class="relative">
      <input
        ref="passwordRef"
        v-if="password"
        v-maska="maska ? '+998 (##) ###-##-##' : null"
        :placeholder="placeholder"
        @keypress.enter="send"
        :type="toggle ? 'text' : 'password'"
        :disabled="disabled"
        autocomplete="off"
        v-model="model"
        :name="name"
        :id="name"
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

      <input
        v-else
        v-maska="maska ? '+998 (##) ###-##-##' : null"
        :placeholder="placeholder"
        @keypress.enter="send"
        :type="type || 'text'"
        :disabled="disabled"
        autocomplete="off"
        v-model="model"
        ref="inputRef"
        :name="name"
        :id="name"
        :class="[
          'w-full px-2 py-1.5 rounded-md bg-transparent outline-none',
          'text-mainText text-base font-medium',
          'ring-1 focus:ring-offset-[1.5px]',
          'placeholder:text-placeholder placeholder:text-sm',
          error
            ? 'ring-red-500 focus:ring-offset-red-500'
            : 'ring-border focus:ring-offset-hoverAside',
        ]"
      />

      <button
        v-if="password"
        type="button"
        @click="focusPassword()"
        class="absolute right-0 bottom-0 inline-flex p-2"
      >
        <EyeIcon v-if="!toggle" class="size-5 text-gray-400" />
        <EyeSlashIcon v-else class="size-5 text-gray-400" />
      </button>
    </div>

    <span
      :class="[
        'absolute transform text-sm text-red-500',
        'left-1 ',
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
import { vMaska } from 'maska/vue'
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
const emit = defineEmits(['send'])

const send = () => {
  emit('send')
}

import { onMounted, watch, ref, nextTick } from 'vue'
const inputRef = ref()
const passwordRef = ref()

const focusPassword = async () => {
  if (passwordRef.value) {
    const position = passwordRef.value.selectionStart
    toggle.value = !toggle.value
    await nextTick()
    passwordRef.value.focus()
    passwordRef.value.setSelectionRange(position, position)
  }
}

const focusInput = () => {
  if (props.focus && inputRef.value) {
    inputRef.value.focus()
  }
}

watch(
  () => props.focus,
  (newVal) => {
    if (newVal && inputRef.value) {
      focusInput()
    }
  },
)

onMounted(() => {
  focusInput()
})

import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
const toggle = ref(false)
</script>
