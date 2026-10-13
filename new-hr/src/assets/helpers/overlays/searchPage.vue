<template>
  <TransitionRoot :show="show" as="template" @after-leave="query = ''" appear>
    <Dialog as="div" :class="[currentTheme, 'relative z-[9999]']" @close="store.setShow(false)">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/25 backdrop-blur transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto p-4 xl:pt-20 sm:!pt-10">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            :class="[
              'mx-auto max-w-6xl transform divide-y divide-border overflow-hidden rounded-xl shadow-2xl ring-1 ring-blur ring-opacity-5 transition-all bg-modal',
            ]"
          >
            <Combobox @update:modelValue="onSelect">
              <div class="relative">
                <MagnifyingGlassIcon
                  class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <ComboboxInput
                  class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-mainText placeholder:text-placeholder focus:ring-0 outline-none"
                  :placeholder="`${$t('search')}...`"
                  @change="query = $event.target.value"
                  autocomplete="off"
                />
              </div>

              <ComboboxOptions
                v-if="filteredItems.length > 0"
                static
                class="max-h-[500px] scroll-py-3 overflow-y-auto p-3 mainScroll"
              >
                <ComboboxOption
                  v-for="item in filteredItems"
                  :key="item.id"
                  :value="item"
                  as="template"
                  v-slot="{ active }"
                >
                  <li
                    :class="[
                      'flex cursor-default select-none rounded-xl p-3',
                      active && 'bg-hover',
                    ]"
                  >
                    <div
                      :class="[
                        'flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-aside',
                      ]"
                    >
                      <component
                        :is="item.icon"
                        class="h-6 w-6 text-whiteText"
                        aria-hidden="true"
                      />
                    </div>
                    <div class="ml-4 flex-auto">
                      <p
                        :class="[
                          'text-sm font-medium',
                          active ? 'text-changeText' : 'text-mainText',
                        ]"
                      >
                        {{ item.name }}
                      </p>
                      <p :class="['text-sm', active ? 'text-changeText' : 'text-mainText']">
                        {{ item.description }}
                      </p>
                    </div>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>

              <div
                v-if="query !== '' && filteredItems.length === 0"
                class="px-6 py-14 text-center text-sm sm:px-14"
              >
                <ExclamationCircleIcon
                  type="outline"
                  name="exclamation-circle"
                  class="mx-auto h-6 w-6 text-red-500"
                />
                <p class="mt-4 font-semibold text-xl text-mainText">{{ title[locale] }}</p>
                <p class="mt-2 text-gray-400">
                  {{ text[locale] }}
                </p>
              </div>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

import { LanguageIcon, SunIcon, HomeIcon } from '@heroicons/vue/20/solid'
import { UsersIcon, BuildingLibraryIcon } from '@heroicons/vue/24/outline'

import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

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
    name: 'Workers',
    description: 'Add freeform text with basic formatting options.',
    url: 'workers',
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

const query = ref('')
const filteredItems = computed(() =>
  query.value === ''
    ? []
    : items.filter((item) => {
        return item.name.toLowerCase().includes(query.value.toLowerCase())
      }),
)

import { useRouter } from 'vue-router'
const router = useRouter()

const onSelect = (item) => {
  store.setShow(false)
  router.push({ name: item.url })
}

import { searchStore } from '@/stores/helpers/search'
const store = searchStore()
const { show } = storeToRefs(store)

import { themeStore } from '@/stores/theme/theme'
const mode = themeStore()
const { currentTheme } = storeToRefs(mode)

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

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
</script>
