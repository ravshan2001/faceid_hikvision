import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive, computed } from 'vue'

const url = '/holiday'
import { notifStore } from '../helpers/notification'

import { loadingStore } from '../helpers/loading'

import { useRouter, useRoute } from 'vue-router'

export const holidayStore = defineStore('holidayStore', () => {
  const loading = loadingStore()
  const notif = notifStore()
  const router = useRouter()
  const route = useRoute()

  const holiday = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const activeHolidays = computed(() => {
    return holiday.data.filter((item) => item.status)
  })

  const nextHoliday = async (limit = 1) => {
    const { data } = await api.get(url, {
      params: {
        limit: limit,
        page: holiday.limit,
      },
    })
    // console.log('NEXT', data)

    if (holiday.count >= route?.query?.limit ? route?.query?.limit : holiday.limit) {
      holiday.data = [
        ...holiday.data,
        ...holiday.data.map((item) => {
          return {
            ...item,
            status: item.status == 'active',
          }
        }),
      ]
    } else {
      holiday.data = [...data.data]
    }
  }

  const changePage = (value) => {
    holiday.page = value
    router.push({ name: 'holiday', query: { page: holiday.page } })
  }

  const allHoliday = async (search) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: holiday.limit,
          page: holiday.page,
          title: search,
        },
      })
      // console.log('holiday', data)
      holiday.data = [
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status == 'active',
          }
        }),
      ]
      holiday.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addHoliday = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)
      // console.log('Created Holiday', data)
      data.status = data.status == 'active'
      holiday.data = [data, ...holiday.data.slice(0, holiday.limit - 1)]
      holiday.count += 1
      loading.setLoading(false)
      notif.setNotif(true, holidayAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveHoliday = async (payload) => {
    try {
      loading.setLoading(true)
      // console.log("ketdi payload", payload);
      
      const { data } = await api.put(`${url}`, payload)
      // console.log('Keldi payload', data)

      holiday.data = holiday.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status == 'active',
          }
        return item
      })
      loading.setLoading(false)
      notif.setNotif(true, holidayUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getHoliday = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const removeHoliday = async (id) => {
    try {
      if (!id) return false
      loading.setLoading(true)
      await api.delete(`${url}/${id}`)
      holiday.data = holiday.data?.filter((item) => item?._id !== id)
      holiday.count -= 1
      loading.setLoading(false)
      notif.setNotif(true, holidayDeletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }



  return {
    holiday,
    allHoliday,
    addHoliday,
    saveHoliday,
    getHoliday,
    removeHoliday,
    nextHoliday,
    changePage,
    activeHolidays,
  }
})


const holidayDeletedMessage = {
  en: 'Holiday deleted',
  ru: 'Праздник удалена',
  uz: 'Bayram kuni o‘chirildi',
  kr: 'Байрам куни ўчирилди',
}

const holidayUpdatedMessage = {
  en: 'Holiday updated',
  ru: 'Праздник обновлена',
  uz: 'Bayram kuni yangilandi',
  kr: 'Байрам куни янгиланди',
}

const holidayAddedMessage = {
  en: 'Holiday added',
  ru: 'Праздник добавлена',
  uz: 'Bayram kuni qo‘shildi',
  kr: 'Байрам куни қўшилди',
}