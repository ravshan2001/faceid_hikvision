import { defineStore } from 'pinia'
import { ref } from 'vue'

export const logoutStore = defineStore('logoutStore', () => {
  const show = ref(false)

  const setShow = (value) => {
    show.value = value
  }

  return {
    show,
    setShow,
  }
})
