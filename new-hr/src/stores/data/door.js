import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive, computed, ref } from 'vue'

const url = '/door'
import { notifStore } from '../helpers/notification'
import { loadingStore } from '../helpers/loading'
import { useRouter, useRoute } from 'vue-router'

export const doorStore = defineStore('doorStore', () => {
  const notif = notifStore()
  const router = useRouter()
  const route = useRoute()
  const loading = loadingStore()

  const door = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const statusDoors = ref([])

  const syncedDoorWorker = reactive({
    data: [],
    doorInfo: {},
    count: 0,
    limit: 30,
    page: 1,
  })

  const activeDoors = computed(() => {
    return door.data.filter((item) => item.status)
  })

  const nextDoor = async (limit = 1) => {
    const { data } = await api.get(url, {
      params: {
        limit: limit,
        page: door.limit,
      },
    })
    if (door.count >= route?.query?.limit ? route?.query?.limit : door.limit) {
      door.data = [
        ...door.data,
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status == 'active',
          }
        }),
      ]
    } else {
      door.data = [...data.data]
    }
  }

  const changePage = (value) => {
    door.page = value
    router.push({ name: 'door', query: { page: door.page } })
  }
  

  const allDoor = async (search) => {
    // console.log("searchDoor", search);
    
    try {
      const { data } = await api.get(url, {
        params: {
          limit: door.limit,
          page: door.page,
          ... search,
        },
      })
      door.data = [...data.data]
      // console.log("Door Data", door.data);
      
      door.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addDoor = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)
      
      data.status = data.status == 'active'
      door.data = [data, ...door.data.slice(0, door.limit - 1)]
      door.count += 1
      loading.setLoading(false)
      notif.setNotif(true, doorAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveDoor = async (payload) => {
    try {
      loading.setLoading(true) 
      const { data } = await api.put(`${url}`, payload)
      console.log("Update Door Data", data);
      door.data = door.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status
          }
        return item
      })
      loading.setLoading(false)
      notif.setNotif(true, doorUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getDoor = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const removeDoor = async (id) => {
    try {
      if (!id) return false
      loading.setLoading(true)
      await api.delete(`${url}/${id}`)
      door.data = door.data?.filter((item) => item?._id !== id)
      door.count -= 1
      loading.setLoading(false)
      notif.setNotif(true, doorDeletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }

  const statusDoor = async (id) => {
    try {
      // console.log("Status Door ID", id);
      
      if (!id) return false
      const { data } = await api.get(`${url}/status/${id}`)
      // console.log("Status Data", data);
      
      door.data = door.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status
          }
        return item
      })
      notif.setNotif(true, statusUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error Status', err)
    }
  }

  // Detail page

  const allSyncedDoorWorker = async (search, user) => {
    console.log("searchSyncedDoor", search);
    
    try {
      const { data } = await api.get('user-synced-door', {
        params: {
          limit: syncedDoorWorker.limit,
          page: syncedDoorWorker.page,
          ...search,
        },
      })
      console.log("Synced Door Data", data);
      
      syncedDoorWorker.data = [
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status,
          }
        }),
      ]
      syncedDoorWorker.count = data?.count
      syncedDoorWorker.doorInfo = data?.doorInfo
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addSyncedWorkerDoor = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.post('user-synced-door', payload)
      syncedDoorWorker.data = [data, ...syncedDoorWorker.data.slice(0, door.limit - 1)]
      syncedDoorWorker.count += 1
      loading.setLoading(false)
      notif.setNotif(true, "Добавлена", 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const returnSyncedWorkerDoor = async (id) => {
    try {
      if (!id) return false
      const { data } = await api.get(`user-synced-door/${id}`)
      console.log("Status Data", data);
      
      syncedDoorWorker.data = syncedDoorWorker.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status
          }
        return item
      })
      notif.setNotif(true, statusUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error Status', err)
    }
  }
  const removeSyncedWorkerDoor = async (id) => {
    try {
      if (!id) return false
      loading.setLoading(true)
      await api.delete(`user-synced-door/${id}`)
      syncedDoorWorker.data = syncedDoorWorker.data?.filter((item) => item?._id !== id)
      syncedDoorWorker.count -= 1
      loading.setLoading(false)
      notif.setNotif(true, doorUserDeletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }
  const changeSyncedWorkerDoorPage = (value, id) => {
    syncedDoorWorker.page = value
    router.push({ name: 'detailDoor', query: { page: syncedDoorWorker.page }, params: { id: id } })
  }

  return {
    door,
    allDoor,
    statusDoors,
    addDoor,
    saveDoor,
    getDoor,
    removeDoor,
    nextDoor,
    changePage,
    statusDoor,
    activeDoors,
    syncedDoorWorker,
    allSyncedDoorWorker,
    changeSyncedWorkerDoorPage,
    addSyncedWorkerDoor,
    removeSyncedWorkerDoor,
    returnSyncedWorkerDoor
  }
})

const statusUpdatedMessage = {
  en: 'Status updated',
  ru: 'Статус обновлён',
  uz: 'Holat yangilandi',
  kr: 'Ҳолат янгиланди',
}

const doorDeletedMessage = {
  en: 'Door deleted',
  ru: 'Дверь удалена',
  uz: 'Eshik o‘chirildi',
  kr: 'Эшик ўчирилди',
}
const doorUserDeletedMessage = {
  en: 'User deleted',
  ru: 'Ползователь удалена',
  uz: 'Xodim o‘chirildi',
  kr: 'Ходим ўчирилди',
}

const doorUpdatedMessage = {
  en: 'Door updated',
  ru: 'Дверь обновлена',
  uz: 'Eshik yangilandi',
  kr: 'Эшик янгиланди',
}

const doorAddedMessage = {
  en: 'Door added',
  ru: 'Дверь добавлена',
  uz: 'Eshik qo‘shildi',
  kr: 'Эшик қўшилди',
}
