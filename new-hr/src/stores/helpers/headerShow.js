import { defineStore } from 'pinia'
import { ref } from 'vue'

export const headerShowStore = defineStore('headerShowStore', () => {
  const show = ref(false)

  const setShow = (value) => {
    show.value = value
  }

  return {
    show,
    setShow,
  }
})
