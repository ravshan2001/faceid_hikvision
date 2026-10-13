import { createI18n } from 'vue-i18n'

import { ru } from './locales/main/ru'
import { en } from './locales/main/en'
import { uz } from './locales/main/uz'
import { kr } from './locales/main/kr'

export const i18n = createI18n({
  locale: localStorage.getItem('language') || 'ru',
  fallbackLocale: 'ru',
  messages: {
    ru,
    en,
    kr,
    uz,
  },
})
