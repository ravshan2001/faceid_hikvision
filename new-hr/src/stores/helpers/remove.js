import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'

export const removeStore = defineStore('removeStore', () => {
  const route = useRoute()
  const remove = ref({
    show: false,
    name: '',
    id: '',
  })

  const setRemove = (show, name, id) => {
    if (route?.name == name) {
      remove.value = {
        show,
        name,
        id,
      }
    } else {
      remove.value = {
        show: false,
        name: '',
        id: '',
      }
    }
  }

  const close = () => {
    remove.value = {
      show: false,
      name: '',
      id: '',
    }
  }

  router.beforeEach((to) => {
    if (to?.name !== remove.value.name) {
      close()
    }
  })

  return {
    remove,
    setRemove,
    close,
  }
})
