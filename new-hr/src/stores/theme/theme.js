import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const themeStore = defineStore('themeStore', () => {
  const theme = reactive([
    {
      id: 'light',
      name: {
        en: 'Light',
        ru: 'Светлый',
        uz: 'Yorug‘',
        kr: 'Ёруғ',
      },
      default: true,
    },
    {
      id: 'dark',
      name: {
        en: 'Dark',
        ru: 'Темный',
        uz: 'Qorong‘i',
        kr: 'Қоронғи',
      },
      default: false,
    },
    {
      id: 'blue',
      name: {
        en: 'Blue',
        ru: 'Синий',
        uz: 'Ko‘k',
        kr: 'Кўк',
      },
      default: false,
    },
  ])

  const savedTheme = localStorage.getItem('theme')
  const currentTheme = ref(savedTheme || theme.find((t) => t.default)?.id)
  document.body.classList.add(currentTheme.value)

  const updateTheme = (newTheme) => {
    document.body.classList.remove(currentTheme.value)
    theme.forEach((item) => {
      item.default = item.id === newTheme
    })
    currentTheme.value = newTheme
    localStorage.setItem('theme', newTheme)
    document.body.classList.add(newTheme)
  }

  return {
    theme,
    currentTheme,
    updateTheme,
  }
})
