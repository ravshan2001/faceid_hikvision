<template>
  <div
    :class="[
      'xl:hidden',
      'h-screen bg-aside border-r border-border',
      'transition-width transition-padding duration-300 will-change-auto',
      'flex flex-col',
      grow ? 'w-[60px] p-2' : 'w-[250px] p-5',
    ]"
  >
    <div class="flex items-center justify-between">
      <h1
        :class="[
          'text-3xl text-whiteText',
          'transform',
          grow ? 'opacity-0 w-0 -translate-x-20' : 'transition duration-300',
        ]"
      >
      HR
    </h1>
    <!-- <img src="../../assets/images/logo.png" class="w-10" alt=""> -->

      <ChevronDoubleLeftIcon
        :class="[
          'py-1 px-2 rounded-lg hover:bg-hoverAside text-whiteText cursor-pointer',
          'transform transition duration-300',
          grow ? 'w-[44px] h-10 rotate-180' : 'w-10 h-10',
        ]"
        @click="aside_store.setGrow()"
      />
    </div>

    <div class="mt-10 flex flex-col gap-5 h-full">
      <nav
        :class="[
          'asideScroll',
          'flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-hide h-fit max-h-[735px] 2xl:max-h-[626px]',
          grow ? '-mr-2 pr-2' : '-mr-5 pr-5',
        ]"
      >
        <router-link
          v-for="item of filteredMenu?.filter((item) => item?.meta?.group == 'main')"
          :key="item.name"
          :to="{ name: item.name }"
          :class="[
            'py-1.5 px-2 text-whiteText rounded-md hover:bg-hoverAside hover:text-blueText',
            'flex items-center gap-2',
            route?.name == item?.name ? 'bg-hoverAside !text-blueText' : 'bg-transparent text-whiteText',
            grow ? 'h-10' : 'w-full',
          ]"
        >
          <component :is="item?.meta?.icon" :class="[grow ? 'w-[27px] h-[27px]' : 'w-6 h-6']" />
          <p :class="[grow ? 'hidden' : 'flex-1']">
            {{ item?.meta?.title[locale] || '' }}
          </p>
        </router-link>
      </nav>

      <nav class="mt-auto flex flex-col">
        <router-link
          v-for="item of filteredMenu?.filter((item) => item?.meta?.group == 'setting')"
          :key="item?.name"
          :to="{ name: 'branch' }"
          :class="[
            'py-1.5 px-2 text-whiteText rounded-md hover:bg-hoverAside hover:text-blueText',
            'flex items-center gap-2',
            settingMenu?.includes(route.name) ? 'bg-hoverAside !text-blueText' : 'bg-transparent text-whiteText',
            grow ? 'h-10' : 'w-full',
          ]"
        >
          <component :is="item?.meta?.icon" :class="[grow ? 'w-[27px] h-[27px]' : 'w-6 h-6']" />
          <p :class="[grow ? 'hidden' : 'flex-1']">
            {{ item?.meta?.title[locale] || '' }}
          </p>
        </router-link>
      </nav>
    </div>
  </div>
</template>x
<script setup>
import { ChevronDoubleLeftIcon } from '@heroicons/vue/20/solid'

import { storeToRefs } from 'pinia'
import { asideStore } from '@/stores/other/aside'
const aside_store = asideStore()
const { grow } = storeToRefs(aside_store)
import { authStore } from '@/stores/admin/auth'
const store = authStore()
const { user } = storeToRefs(store)



import { menu } from '@/router/nav/menu'
import { useRoute } from 'vue-router'
const route = useRoute()

import { computed } from 'vue'
import { setting } from '@/router/setting/setting'

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const settingMenu = computed(() => {
  return setting?.map((item) => item?.name)
})

const filteredMenu = computed(() => {
  return menu.filter((item) => {
    // agar access yo‘q bo‘lsa — barchaga ochiq
    if (!item.access && !item.meta?.access) return true

    const accessRoles = item.access || item.meta?.access
    return accessRoles.includes(user.value?.role)
  })
})


</script>
