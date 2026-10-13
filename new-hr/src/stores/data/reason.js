import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive, computed } from 'vue'

const url = '/reason'
import { notifStore } from '../helpers/notification'

import { loadingStore } from '../helpers/loading'

import { useRouter, useRoute } from 'vue-router'

export const reasonStore = defineStore('reasonStore', () => {
  const loading = loadingStore()
  const notif = notifStore()
  const router = useRouter()
  const route = useRoute()

  const reason = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const activeReasons = computed(() => {
    return reason.data.filter((item) => item.status)
  })

  const nextReason = async (limit = 1) => {
    const { data } = await api.get(url, {
      params: {
        limit: limit,
        page: reason.limit,
      },
    })
    // console.log('NEXT', data)

    if (reason.count >= route?.query?.limit ? route?.query?.limit : reason.limit) {
      reason.data = [
        ...reason.data,
        ...reason.data.map((item) => {
          return {
            ...item,
            status: item.status == 'active',
          }
        }),
      ]
    } else {
      reason.data = [...data.data]
    }
  }

  const changePage = (value) => {
    reason.page = value
    router.push({ name: 'reason', query: { page: reason.page } })
  }

  const allReasons = async (search) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: reason.limit,
          page: reason.page,
          title: search,
        },
      })
      // console.log('reason', data)
      reason.data = [
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status == 'active',
          }
        }),
      ]
      reason.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addReason = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)
      // console.log('Created Reason', data)
      data.status = data.status == 'active'
      reason.data = [data, ...reason.data.slice(0, reason.limit - 1)]
      reason.count += 1
      loading.setLoading(false)
      notif.setNotif(true, reasonAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveReason = async (payload) => {
    try {
      loading.setLoading(true)
      // console.log("ketdi payload", payload);
      
      const { data } = await api.put(`${url}`, payload)
      // console.log('Keldi payload', data)

      reason.data = reason.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status == 'active',
          }
        return item
      })
      loading.setLoading(false)
      notif.setNotif(true, reasonUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getReason = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const removeReason = async (id) => {
    try {
      if (!id) return false
      loading.setLoading(true)
      await api.delete(`${url}/${id}`)
      reason.data = reason.data?.filter((item) => item?._id !== id)
      reason.count -= 1
      loading.setLoading(false)
      notif.setNotif(true, ReasonDeletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }



  return {
    reason,
    allReasons,
    addReason,
    saveReason,
    getReason,
    removeReason,
    nextReason,
    changePage,
    activeReasons,
  }
})


const ReasonDeletedMessage = {
  en: 'Reason deleted',
  ru: 'Причина удалена',
  uz: 'Sabab o‘chirildi',
  kr: 'Сабаб ўчирилди',
}

const reasonUpdatedMessage = {
  en: 'Reason updated',
  ru: 'Причина обновлена',
  uz: 'Sabab yangilandi',
  kr: 'Сабаб янгиланди',
}

const reasonAddedMessage = {
  en: 'Reason added',
  ru: 'Причина добавлена',
  uz: 'Sabab qo‘shildi',
  kr: 'Сабаб қўшилди',
}