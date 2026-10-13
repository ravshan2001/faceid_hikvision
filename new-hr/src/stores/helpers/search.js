import { defineStore } from 'pinia'
import { ref } from 'vue'

export const searchStore = defineStore('searchStore', () => {
  const show = ref(false)

  const setShow = (value) => {
    show.value = value
  }

  return {
    show,
    setShow,
  }
})
