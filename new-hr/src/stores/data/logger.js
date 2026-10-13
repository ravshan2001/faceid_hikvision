import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive } from 'vue'

const url = '/logger'
import { notifStore } from '../helpers/notification'

import { loadingStore } from '../helpers/loading'

import { useRouter, useRoute } from 'vue-router'




export const loggerStore = defineStore('loggerStore', () => {
  const loading = loadingStore()
  const notif = notifStore()
  const router = useRouter()
  const route = useRoute()

  const loggerRouter = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })
  const loggerDoor = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const allLoggerRouter = async (search) => {
    try {
      const { data } = await api.get(`${url}/route-logs`, {
        params: {
          limit: loggerRouter.limit,
          page: loggerRouter.page,
          ...search
        },
      })
      // console.log('logger', data)
      loggerRouter.data = [...data.data]
      loggerRouter.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const allLoggerDoor = async (search) => {
    try {
      const { data } = await api.get(`${url}/door`, {
        params: {
          limit: loggerDoor.limit,
          page: loggerDoor.page,
          ...search
        },
      })
      // console.log('logger', data)
      loggerDoor.data = [...data.data]
      loggerDoor.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }
  


  return {
    loggerRouter,
    loggerDoor,
    allLoggerRouter,
    allLoggerDoor,
  }
})

