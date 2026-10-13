import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const asideStore = defineStore('asideStore', () => {
  const grow = ref(JSON.parse(localStorage.getItem('Grow')) || false)

  const setGrow = () => {
    grow.value = !grow.value
  }

  watch(grow, (newValue) => {
    localStorage.setItem('Grow', JSON.stringify(newValue))
  })

  return {
    grow,
    setGrow,
  }
})
