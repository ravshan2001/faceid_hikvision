import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive, computed } from 'vue'

const url = '/absence'
import { notifStore } from '../helpers/notification'

import { loadingStore } from '../helpers/loading'

import { useRouter, useRoute } from 'vue-router'

export const absenceStore = defineStore('absenceStore', () => {
  const loading = loadingStore()
  const notif = notifStore()
  const router = useRouter()
  const route = useRoute()

  const absence = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const activeAbsence = computed(() => {
    return absence.data.filter((item) => item.status)
  })

  const nextAbsence = async (limit = 1) => {
    const { data } = await api.get(url, {
      params: {
        limit: limit,
        page: absence.limit,
      },
    })
    // console.log('NEXT', data)

    if (absence.count >= route?.query?.limit ? route?.query?.limit : absence.limit) {
      absence.data = [
        ...absence.data,
        ...absence.data.map((item) => {
          return {
            ...item,
            status: item.status == 'active',
          }
        }),
      ]
    } else {
      absence.data = [...data.data]
    }
  }

  const changePage = (value) => {
    absence.page = value
    router.push({ name: 'absence', query: { page: absence.page } })
  }

  const allAbsence = async (params) => {
    try {
      params.limit = absence.limit
      params.page = absence.page

      const { data } = await api.get(url, {params})
      // console.log('absence', data)
      absence.data = [
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status == 'active',
          }
        }),
      ]
      absence.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addAbsence = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)
      // console.log('Created Absence', data)
      data.status = data.status == 'active'
      absence.data = [data, ...absence.data.slice(0, absence.limit - 1)]
      absence.count += 1
      loading.setLoading(false)
      notif.setNotif(true, absenceAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveAbsence = async (payload) => {
    try {
      loading.setLoading(true)
      // console.log("ketdi payload", payload);
      
      const { data } = await api.put(`${url}`, payload)
      // console.log('Keldi payload', data)

      absence.data = absence.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status == 'active',
          }
        return item
      })
      loading.setLoading(false)
      notif.setNotif(true, absenceUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getAbsence = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const removeAbsence = async (id) => {
    try {
      if (!id) return false
      loading.setLoading(true)
      await api.delete(`${url}/${id}`)
      absence.data = absence.data?.filter((item) => item?._id !== id)
      absence.count -= 1
      loading.setLoading(false)
      notif.setNotif(true, absenceDeletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }



  return {
    absence,
    allAbsence,
    addAbsence,
    saveAbsence,
    getAbsence,
    removeAbsence,
    nextAbsence,
    changePage,
    activeAbsence,
  }
})


const absenceDeletedMessage = {
  en: 'Absence deleted',
  ru: 'Отсутствие удалена',
  uz: 'Sabab o‘chirildi',
  kr: 'Отсутствие ўчирилди',
}

const absenceUpdatedMessage = {
  en: 'Absence updated',
  ru: 'Отсутствие обновлена',
  uz: 'Sabab yangilandi',
  kr: 'Отсутствие янгиланди',
}

const absenceAddedMessage = {
  en: 'Absence added',
  ru: 'Отсутствие добавлена',
  uz: 'Sabab qo‘shildi',
  kr: 'Отсутствие қўшилди',
}