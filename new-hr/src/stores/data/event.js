import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive } from 'vue'

const url = '/event'
import { notifStore } from '../helpers/notification'

import { loadingStore } from '../helpers/loading'

import { useRouter, useRoute } from 'vue-router'




export const eventStore = defineStore('eventStore', () => {
  const loading = loadingStore()
  const notif = notifStore()
  const router = useRouter()
  const route = useRoute()

  const event = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const allEvent = async (search) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: event.limit,
          page: event.page,
          ...search
        },
      })
      // console.log('event', data)
      event.data = [...data.data]
      event.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }
  const newEventForSocket = async (count) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: count,
          page: 1,
        },
      })
      const newEvents = data.data || []
      const merged = [...newEvents, ...event.data]
      console.log("newEvents", newEvents);
      console.log("merged", merged);
      const uniqueEvents = merged.reduce((acc, current) => {
        const exists = acc.find(item => item._id === current._id)
        if (!exists) acc.push(current)
        return acc
      }, [])
      event.data = uniqueEvents.slice(0, event.limit)
      event.count += newEvents.length
      // console.log('socketEvent', data)
      // event.data = [...data.data, ...event.data]
      // event.count += data.data.length
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addCalendarEvent = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)
      event.data = [data, ...event.data.slice(0, event.limit - 1)]
      event.count += 1
      loading.setLoading(false)
      notif.setNotif(true, eventAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const changePage = (value) => {
    event.page = value
    router.push({ name: 'event', query: { page: event.page } })
  }
  const changeWorkerPage = (value) => {
    event.page = value
    router.push({ name: 'worker-events', query: { page: event.page } })
  }


  const syncEvent = async (payload) => {
    try {
      // console.log("payload", payload);
      // console.log(`${url}/sync`);
      
      
      // loading.setLoading(true)
      const { data } = await api.post(`${url}/sync`, payload)
      // console.log("data", data);
      
      // loading.setLoading(false)
      if(data) notif.setNotif(true, sinxrStartMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getEvent = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }
  
  
  const endEvent = async () => {
    notif.setNotif(true, sinxrEndMessage, 'success')
  }


  return {
    event,
    allEvent,
    getEvent,
    changePage,
    syncEvent,
    endEvent,
    changeWorkerPage,
    addCalendarEvent,
    newEventForSocket
  }
})

const eventAddedMessage = {
  en: 'Event added',
  ru: 'События добавлена',
  uz: 'Zapis qo‘shildi',
  kr: 'Запис қўшилди',
}


const sinxrStartMessage = {
  en: 'Synchronization has started.',
  ru: 'Синхронизация началась.',
  uz: 'Sinxronizatsiya boshlandi.',
  kr: 'Синхронизация бошланди.',
}
const sinxrEndMessage = {
  en: 'Synchronization completed.',
  ru: 'Синхронизация завершилась.',
  uz: 'Sinxronizatsiya tugadi.',
  kr: 'Синхронизация тугади.',
}


