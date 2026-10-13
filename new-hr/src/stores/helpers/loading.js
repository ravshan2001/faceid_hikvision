import { defineStore } from 'pinia'
import { ref } from 'vue'

export const loadingStore = defineStore('loadingStore', () => {
  const loading = ref(false)

  const setLoading = (value) => {
    // console.log("loadingStore", value);
    
    loading.value = value
  }

  return {
    loading,
    setLoading,
  }
})
