<template>
  <div v-if="visibility" class="flex items-center justify-center h-[calc(100%-57px)]">
    <div
      class="text-changeText font-bold text-xl text-center flex items-center gap-2 sm:flex-col sm:gap-1"
    >
      <InformationCircleIcon class="w-10 h-10" />
      {{ noInformationMessage[locale] }}
    </div>
  </div>
</template>
<script setup>
defineProps({
  visibility: {
    type: Boolean,
    required: true,
  },
})
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const noInformationMessage = {
  en: 'Currently, there is no information available here!',
  ru: 'В настоящее время здесь нет доступной информации!',
  uz: 'Hozircha bu yerda hech qanday ma’lumot mavjud emas!',
  kr: 'Ҳозирча бу ерда ҳеч қандай маълумот мавжуд эмас!',
}
</script>
