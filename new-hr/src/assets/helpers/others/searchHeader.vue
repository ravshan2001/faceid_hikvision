<template>
  <div class="flex-1 h-full xl:hidden relative">
    <div class="flex items-center h-full">
      <label for="search">
        <MagnifyingGlassIcon class="w-6 h-6 text-placeholder sm:w-5 sm:h-5" />
      </label>
      <input
        type="search"
        id="search"
        class="flex-1 h-full px-2 outline-none text-lg bg-transparent text-mainText placeholder:text-placeholder font-medium placeholder:text-base"
        :placeholder="`${$t('search')}...`"
        autocomplete="off"
        v-model="query"
        @change="query = $event.target.value"
        ref="searchInput"
      />
    </div>

    <Combobox @update:modelValue="onSelect">
      <ComboboxOptions
        v-if="filteredItems.length > 0"
        static
        class="absolute top-[60px] w-full max-h-[600px] scroll-py-3 overflow-y-auto p-3 bg-searchBg shadow-lg rounded-lg z-50 mainScroll"
      >
        <ComboboxOption
          v-for="item in filteredItems"
          :key="item.id"
          :value="item"
          as="template"
          v-slot="{ active }"
        >
          <li :class="['flex cursor-default select-none rounded-xl p-3', active && 'bg-hover']">
            <div
              :class="['flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-aside']"
            >
              <component :is="item.icon" class="h-6 w-6 text-whiteText" aria-hidden="true" />
            </div>
            <div class="ml-4 flex-auto">
              <p :class="['text-sm font-medium', active ? 'text-changeText' : 'text-mainText']">
                {{ item.name }}
              </p>
              <p :class="['text-sm', active ? 'text-changeText' : 'text-mainText']">
                {{ item.description }}
              </p>
            </div>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </Combobox>

    <div
      v-if="query !== '' && filteredItems.length === 0"
      class="px-6 py-14 text-center text-sm sm:px-14 bg-searchBgNotFound rounded-md mt-1"
    >
      <ExclamationCircleIcon
        type="outline"
        name="exclamation-circle"
        class="mx-auto h-6 w-6 text-red-500"
      />
      <p class="mt-4 font-semibold text-xl text-whiteText">{{ title[locale] }}</p>
      <p class="mt-2 text-whiteText">
        {{ text[locale] }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import { ComboboxOptions, ComboboxOption, Combobox } from '@headlessui/vue'

import { LanguageIcon, SunIcon, HomeIcon } from '@heroicons/vue/20/solid'
import { UsersIcon, BuildingLibraryIcon } from '@heroicons/vue/24/outline'

import { useRouter } from 'vue-router'
const router = useRouter()

const searchInput = ref()

const onSelect = (item) => {
  router.push({ name: item.url })
}

const query = ref('')
const { locale } = useI18n()

const items = [
  {
    id: 1,
    name: 'Home',
    description: 'Add freeform text with basic formatting options.',
    url: 'home',
    icon: HomeIcon,
  },
  {
    id: 2,
    name: 'Department',
    description: 'Add freeform text with basic formatting options.',
    url: 'department',
    icon: BuildingLibraryIcon,
  },
  {
    id: 3,
    name: 'Users',
    description: 'Add freeform text with basic formatting options.',
    url: 'users',
    icon: UsersIcon,
  },
  {
    id: 4,
    name: 'Language',
    description: 'Add freeform text with basic formatting options.',
    url: 'language',
    icon: LanguageIcon,
  },
  {
    id: 5,
    name: 'Theme',
    description: 'Add freeform text with basic formatting options.',
    url: 'theme',
    icon: SunIcon,
  },
]

const filteredItems = computed(() =>
  query.value === ''
    ? []
    : items.filter((item) => {
        return item.name.toLowerCase().includes(query.value.toLowerCase())
      }),
)

const title = {
  en: 'No results found!',
  ru: 'Результаты не найдены!',
  uz: 'Natijalar topilmadi!',
  kr: 'Натижалар топилмади!',
}

const text = {
  en: 'No components found for this search term. Please try again.',
  ru: 'Компоненты по этому запросу не найдены. Пожалуйста, попробуйте снова.',
  uz: 'Ushbu qidiruv so‘rovi bo‘yicha hech qanday komponent topilmadi. Iltimos, qayta urinib ko‘ring.',
  kr: 'Ушбу қидирув сўрови бўйича ҳеч қандай компонент топилмади. Илтимос, қайта уриниб кўринг.',
}

const handleClickOutside = (event) => {
  if (!event.target.closest('#search')) {
    query.value = ''
  }
}

const handleKeyPress = () => {
  if (event.ctrlKey && event.code === 'KeyK') {
    event.preventDefault()
    searchInput.value.focus()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>
