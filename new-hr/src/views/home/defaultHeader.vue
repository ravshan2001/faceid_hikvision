<template>
  <section
    :class="[
      'h-[60px] sticky top-0 left-0 border-b border-border z-40 px-5 sm:px-2 transition-transform duration-300',
      show ? 'sm:-translate-y-full' : 'sm:translate-y-0',
    ]"
  >
    <div class="flex items-center gap-5 h-full sm:gap-3 xl:justify-between">
      <hamburgerPage />
      <searchHeader v-if="route.name == 'home'" />
      <defaultHeaderSearch v-model="model" @search-event="searchEvent" v-else />

      <div class="flex items-center gap-5">
        <button
        type="button"
        class="hidden md:flex w-10 h-10 items-center justify-center rounded-md bg-btn hover:bg-btnHover"
        @click="search_store.setShow(true)"
        >
        <MagnifyingGlassIcon class="w-6 h-6 text-whiteText sm:w-5 sm:h-5" />
      </button>
      <div class="sm:hidden flex items-center justify-center">
        <!-- <langPicker /> -->
        <BellIcon class="w-6 h-6 text-placeholder cursor-pointer" />
        </div>
        <div class="sm:hidden flex items-center justify-center">
          <themePicker />
        </div>
        <headerDropdown />
      </div>
    </div>
  </section>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { BellIcon } from '@heroicons/vue/24/outline'
import themePicker from '@/assets/helpers/others/themePicker.vue'
import defaultHeaderSearch from '@/assets/helpers/others/defaultHeaderSearch.vue'

const model = defineModel()
const emit = defineEmits(['searchEvent'])
const searchEvent = () => {
  emit('searchEvent')
}
import { useRoute } from 'vue-router'
const route = useRoute()

import headerDropdown from '@/assets/helpers/overlays/headerDropdown.vue'
import hamburgerPage from '@/assets/helpers/overlays/hamburgerPage.vue'
import langPicker from '@/assets/helpers/others/langPicker.vue'
import searchHeader from '@/assets/helpers/others/searchHeader.vue'

import { searchStore } from '@/stores/helpers/search'
const search_store = searchStore()

import { storeToRefs } from 'pinia'
import { headerShowStore } from '@/stores/helpers/headerShow'
const header_store = headerShowStore()
const { show } = storeToRefs(header_store)
</script>
