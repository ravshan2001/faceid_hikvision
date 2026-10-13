import { defineStore } from 'pinia'
import { ref } from 'vue'

export const notifStore = defineStore('notifStore', () => {
  const notif = ref({
    show: false,
    msg: {},
    type: 'success',
  })

  const setNotif = (show, msg, type, time) => {
    notif.value = {
      show,
      msg,
      type,
    }

    setTimeout(() => {
      notif.value = {
        show: false,
        msg: {},
      }
    }, time || 2000)
  }

  return {
    notif,
    setNotif,
  }
})
