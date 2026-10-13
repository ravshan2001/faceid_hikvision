import { i18n } from '@/i18n/i18n'
import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { api } from '@/helpers/api'
import { useRouter } from 'vue-router'

import en from '@/assets/svg/english.svg'
import ru from '@/assets/svg/russian.svg'
import uz from '@/assets/svg/uzbek.svg'

export const languageStore = defineStore('languageStore', () => {
  const lang = ref(localStorage.getItem('language') || 'ru')
  const router = useRouter()

  const language = ref([
    {
      id: 'ru',
      name: 'Ru',
      icon: ru,
    },
    {
      id: 'en',
      name: 'En',
      icon: en,
    },
    {
      id: 'uz',
      name: 'Uz',
      icon: uz,
    },
    {
      id: 'kr',
      name: 'Ўз',
      icon: uz,
    },
  ])

  const setLang = (value) => {
    lang.value = value
    localStorage.setItem('language', value)
    i18n.global.locale = value
    // Til o‘zgarganda URL ni yangilash
    const currentRoute = router.currentRoute.value

    if (value === 'ru') {
      router.replace(currentRoute.fullPath.replace(/^\/(en|kr|uz)/, ''))
    } else {
      router.replace(`/${value}${currentRoute.fullPath.replace(/^\/(en|kr|uz)/, '')}`)
    }
  }

  return {
    lang,
    language,
    setLang,
  }
})
