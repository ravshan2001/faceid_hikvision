<template>
  <Combobox as="div" v-model="model" multiple>
    <ComboboxLabel class="block text-sm font-medium text-changeText ml-1">
      {{ label }}
      <span v-if="required" class="text-sm text-red-500 font-medium">*</span>
    </ComboboxLabel>

    <div class="relative mt-1" ref="selectRef" tabindex="0">
      <ComboboxButton
        class="w-full rounded-md border-0 bg-transparent py-1.5 px-3 text-mainText shadow-sm flex items-center relative ring-1 focus:ring-offset-[1.5px]"
        :class="
          error
            ? 'ring-red-500 focus:ring-offset-red-500'
            : 'ring-border focus:ring-offset-hoverAside'
        "
      >
        <ComboboxInput
          class="flex-1 outline-none bg-transparent text-mainText text-base font-medium placeholder:text-placeholder placeholder:text-sm"
          autocomplete="off"
          :placeholder="placeholder"
          @input="onInput"
          :display-value="() => model.map((personId) => getPersonTitleById(personId)).join(', ')"
        />

        <ChevronUpDownIcon class="size-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions
        v-if="filteredCategory.length > 0"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm bg-main text-sm text-mainText"
      >
        <ComboboxOption
          v-for="category in filteredCategory"
          :key="category._id"
          :value="category._id"
          as="template"
          v-slot="{ active, selected }"
        >
          <li
            class="relative cursor-pointer select-none py-2 pl-3 pr-9 z-10 hover:bg-btnHover hover:text-whiteText group"
            :class="[active ? 'bg-hover' : 'bg-main text-changeText']"
          >
            <span :class="['block truncate', selected && 'font-semibold']">
              {{ category[option_title] }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 right-0 flex items-center pr-4 group-hover:text-whiteText"
            >
              <CheckIcon class="size-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>

      <span
        class="absolute transform text-sm text-red-500 left-1"
        :class="
          error
            ? '-translate-y-[1px] transition duration-100'
            : 'opacity-0 -translate-y-[18px] pointer-events-none'
        "
      >
        {{ guide }}
      </span>
    </div>
  </Combobox>
</template>

<script setup>
import { computed, ref } from 'vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Select from the list',
  },
  name: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  option_title: {
    type: String,
    default: 'name',
  },
  error: {
    type: Boolean,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: Boolean,
  guide: String,
})

const query = ref('')
const model = defineModel()

defineEmits(['input'])
const filteredCategory = computed(() => {
  return query.value === ''
    ? props.options
    : props.options.filter((category) =>
        category[props.option_title].toLowerCase().includes(query.value.toLowerCase()),
      )
})

function getPersonTitleById(id) {
  const category = props.options.find((p) => p._id === id)
  return category ? category[props.option_title] : ''
}

function onInput(event) {
  query.value = event.target.value
}

import { onMounted } from 'vue'
const selectRef = ref()
onMounted(() => {
  selectRef.value?.focus()
})
</script>
