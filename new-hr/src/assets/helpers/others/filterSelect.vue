<template>
  <Combobox as="div" v-model="selectedPerson">
    <ComboboxLabel class="block text-sm font-medium leading-6 text-[#645A77]" v-if="label">{{
      label
    }}</ComboboxLabel>
    <div class="relative border-[1px] border-gray-300 rounded-md">
      <ComboboxButton class="inset-y-0 w-full flex items-center rounded-r-md text-mainText focus:outline-none">
        <ComboboxInput
          class="w-full rounded-md border-0 bg-white py-1.5 pl-2 pr-10 text-mainText placeholder:text-mainText placeholder:font-semibold shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#0e0929] focus:outline-0"
          :placeholder="placeholder"
          @input="onInput"
          :display-value="(person) => getPersonTitleById(person)"
          autocomplete="off"
        />
        <ChevronUpDownIcon class="absolute right-1 h-5 w-5 text-gray-900" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions
        v-if="filteredPeople.length > 0"
        class="absolute z-[99] mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm ring-0 border-0 outline-none"
      >
        <ComboboxOption
          v-for="person in filteredPeople"
          :key="person._id"
          :value="person._id"
          as="template"
          v-slot="{ active, selected }"
          class="text-gray-900"
        >
          <li
            :class="[
              'relative cursor-default select-none py-2 pl-3 pr-9',
              active ? 'bg-[#0e0929] text-white' : 'text-gray-800'
            ]"
          >
            <span :class="['block truncate', selected && 'font-semibold']">
              {{ getPersonTitle(person) }}
            </span>
            <span
              v-if="selected"
              :class="[
                'absolute inset-y-0 right-0 flex items-center pr-4',
                active ? 'text-white' : 'text-indigo-600'
              ]"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/vue'


function getPersonTitle(person) {
  return optionFields.value
    .map(field => person?.[field])
    .filter(Boolean)
    .join(' ')
}

const optionFields = computed(() => {
  if (Array.isArray(props.option_title)) {
    return props.option_title
  } else if (typeof props.option_title === 'string') {
    return props.option_title.split(' ')
  }
  return []
})


const props = defineProps({
  label: {
    type: String,
  },
  placeholder: {
    type: String,
    default: 'Выберите из списка'
  },
  name: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  option_title: {
    type: [String, Array],
    default: [] // Default to 'title', but can be overridden
  },
  error: {
    type: [String, Boolean],
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  suffix: {
    type: String,
    default: ''
  }
})

// Internal state for the search query and selected person ID
const query = ref('')
const selectedPerson = ref(null)

// Define emit for updating v-model
const emit = defineEmits(['update:modelValue'])

// Computed array of filtered options based on the search query
const filteredPeople = computed(() => {
  if (query.value === '') return props.options

  return props.options.filter(person => {
    const title = optionFields.value
      .map(field => String(person?.[field] || '').toLowerCase())
      .join(' ')

    return title.includes(query.value.toLowerCase())
  })
})
// Function to get the title of a person by their ID (for display purposes)
function getPersonTitleById(id) {
  const person = props.options.find((p) => p._id === id)
  return person ? getPersonTitle(person) : ''
}

// Function to handle input change and update the search query
function onInput(event) {
  query.value = event.target.value
}



// Watch for changes to selectedPerson and emit only the ID
watch(selectedPerson, (newValue) => {
  emit('update:modelValue', newValue)
  emit('change', newValue)
})
</script>
