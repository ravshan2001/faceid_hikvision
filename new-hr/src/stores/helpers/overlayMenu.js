import { defineStore } from 'pinia'
import { ref } from 'vue'

export const overlayStore = defineStore('overlayStore', () => {
  const show = ref(false)

  const setShow = (value) => {
    show.value = value || !show.value
  }

  return {
    show,
    setShow,
  }
})
