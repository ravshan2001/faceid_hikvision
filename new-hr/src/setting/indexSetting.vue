<template>
  <div class="min-w-[200px] max-h-[50px] flex-1 xl:hidden">
    <div class="p-1 h-full rounded-md">
      <nav class="flex h-full gap-4">
        <router-link
          v-for="item of filteredSetting"
          :key="item?.name"
          :to="{ name: item?.name || '' }"
          :class="[
            'flex items-center gap-1 text-blueText py-1.5 px-2 rounded-md hover:bg-aside hover:text-whiteText',
            item?.name == route?.name ? 'bg-aside !text-whiteText' : 'bg-transparent text-blueText',
          ]"
        >
          <component :is="item?.meta?.icon" class="w-6 h-6" />
          <p class="flex-1">
            {{ item?.meta?.title[locale] || '' }}
          </p>
        </router-link>
      </nav>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { setting } from '@/router/setting/setting'
import { useRoute } from 'vue-router'
const route = useRoute()

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

import { authStore } from '@/stores/admin/auth'
const store = authStore()
const { user } = storeToRefs(store)


const filteredSetting = computed(() => {
  return setting.filter((item) => {
    // access bo‘lmasa hamma ko‘ra oladi
    if (!item.access && !item.meta?.access) return true

    const accessRoles = item.access || item.meta?.access
    return accessRoles.includes(user.value?.role)
  })
})
</script>
