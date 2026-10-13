import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive } from 'vue'

const url = '/worker/history'
import { notifStore } from '../helpers/notification'

import { loadingStore } from '../helpers/loading'

import { useRouter, useRoute } from 'vue-router'

export const workerHistoryStore = defineStore('workerHistoryStore', () => {
  const loading = loadingStore()
  const notif = notifStore()
  const router = useRouter()
  const route = useRoute()

  const workerHistory = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const nextWorker = async (limit, id) => {
    // console.log("nextworkerId", id);
    
    const { data } = await api.get(url, {
      params: {
        limit: limit,
        page: workerHistory.limit,
        user: id
      },
    })
    // console.log('NEXT', data)

    if (workerHistory.count >= route?.query?.limit ? route?.query?.limit : workerHistory.limit) {
      workerHistory.data = [...workerHistory.data, ...data.data.slice(0, limit-1)]
    } else {
      workerHistory.data = [...data.data]
    }
  }

  const changePage = (value) => {
    workerHistory.page = value
    router.push({ name: 'worker-history', query: { page: workerHistory.page } })
  }

  const allWorkerHistory = async (id) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: workerHistory.limit,
          page: workerHistory.page,
          user: id,
        },
      })
      // console.log('Worker', data)
      workerHistory.data = [...data.workerHistory]
      workerHistory.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addWorker = async (payload) => {
    // console.log('Payload', payload)

    try {
      loading.setLoading(true)
      // console.log('PayloadAAdd', payload);
      
      const { data } = await api.post(url, payload)
      // console.log('Kelgan', data)

      workerHistory.data = [data, ...workerHistory.data.slice(0, workerHistory.limit - 1)]
      workerHistory.count += 1
      loading.setLoading(false)
      notif.setNotif(true, workerAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveWorker = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.put(`${url}`, payload)
      // console.log('Save Worker', data)

      workerHistory.data = workerHistory.data?.map((item) => {
        if (item?._id == data?._id) return data
        return item
      })
      loading.setLoading(false)
      notif.setNotif(true, workerUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getWorker = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const removeWorker = async (id) => {
    try {
      if (!id) return false
      loading.setLoading(true)
      await api.delete(`${url}/${id}`)
      workerHistory.data = workerHistory.data?.filter((item) => item?._id !== id)
      workerHistory.count -= 1
      loading.setLoading(false)
      notif.setNotif(true, workerDeletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }

  return {
    workerHistory,
    allWorkerHistory,
    addWorker,
    saveWorker,
    getWorker,
    removeWorker,
    nextWorker,
    changePage,
  }
})

const workerDeletedMessage = {
  en: 'Worker deleted',
  ru: 'Работник удалён',
  uz: 'Ishchi o‘chirildi',
  kr: 'Ишчи ўчирилди',
}

const workerUpdatedMessage = {
  en: 'Worker updated',
  ru: 'Работник обновлён',
  uz: 'Ishchi yangilandi',
  kr: 'Ишчи янгиланди',
}

const workerAddedMessage = {
  en: 'Worker added',
  ru: 'Работник добавлен',
  uz: 'Ishchi qo‘shildi',
  kr: 'Ишчи қўшилди',
}
