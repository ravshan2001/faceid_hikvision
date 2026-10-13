import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive, computed, ref } from 'vue'

const url = '/user'
import { notifStore } from '../helpers/notification'

import { loadingStore } from '../helpers/loading'

import { useRoute, useRouter } from 'vue-router'

export const userStore = defineStore('userStore', () => {
  const notif = notifStore()
  const loading = loadingStore()
  const router = useRouter()
  const route = useRoute()

  const users = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const reloadCalendar = ref(0)

  const activeUser = computed(() => {
    return users.data.filter((item) => item.status)
  })

  const nextUser = async (limit = 1) => {
    const { data } = await api.get(url, {
      params: {
        limit: limit,
        page: users.limit,
      },
    })
    // console.log('NEXT', data)

    if (users.count >= route?.query?.limit ? route?.query?.limit : users.limit) {
      users.data = [
        ...users.data,
        ...data.data.map((item) => {
          return { ...item, status: item.status }
        }),
      ]
    } else {
      users.data = [...data.data]
    }
  }

  const changePage = async (value, query) => {
    console.log(route.query)
    users.page = value
    router.push({ name: 'workers', query: { ...query, page: users.page } })
  }

  const reloadCalendarFunction = async () => {
    reloadCalendar.value++
  }

  const allUsers = async (dataSearch, search) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: users.limit,
          page: users.page,
          ...dataSearch,
          fullName: search,
        },
      })
      console.log('users', data)

      users.data = [
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status,
          }
        }),
      ]
      users.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addUser = async (payload) => {
    // console.log('Payload', payload)

    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)

      data.status = data.status
      users.data = [data, ...users.data.slice(0, users.limit - 1)]
      users.count += 1
      loading.setLoading(false)
      notif.setNotif(true, userAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveUser = async (payload) => {
    // console.log('Payload', payload)

    try {
      loading.setLoading(true)
      const { data } = await api.put(url, payload)
      // console.log('Save User', data)

      users.data = users.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status,
          }
        return item
      })
      loading.setLoading(false)
      notif.setNotif(true, userUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getUser = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }
  const getUserInfo = async (id) => {
    try {
      if (!id) return false
      const { data } = await api.get(`${url}/info/${id}`)
      return data
    } catch (err) {
      console.warn('Error', err)
    }
  }
  const getWorkdays = async () => {
    try {
      if (!id) return false
      const { data } = await api.get(`${url}/work-day`)
      return data
    } catch (err) {
      console.warn('Error', err)
    }
  }

  // UserCaLENDAR
  const getWorkdayCalendar = async (params) => {
    try {
      const { data } = await api.get(`statistic/user/calendar`, { params })
      return data
    } catch (err) {
      console.warn('Error', err)
    }
  }
  const getOneWorkdayCalendar = async (id) => {
    try {
      const { data } = await api.get(`${url}/calendar/${id}`)
      // console.log('One Workday Calendar', data);
      return data
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveUserCalendar = async (payload) => {
    try {
      loading.setLoading(true)
      // console.log("ketdi payload", payload);

      const { data } = await api.put(`${url}/calendar`, payload)
      // console.log('Keldi payload', data)

      return data
      loading.setLoading(false)
      notif.setNotif(true, userCelendarUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const userCreateCalendar = async (payload) => {
    try {
      const { data } = await api.post(`${url}/calendar`, payload)

      return data
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const removeUser = async (id) => {
    try {
      await api.delete(`${url}/${id}`)
      users.data = users.data?.filter((item) => item?._id !== id)
      users.count -= 1
      notif.setNotif(true, userDeletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }

  const statusUser = async (id) => {
    try {
      const { data } = await api.get(`${url}/status/${id}`)

      users.data = users.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status,
          }
        return item
      })
      notif.setNotif(true, statusUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error Status', err)
    }
  }

  return {
    users,
    reloadCalendar,
    reloadCalendarFunction,
    allUsers,
    addUser,
    saveUser,
    getUser,
    removeUser,
    statusUser,
    nextUser,
    changePage,
    activeUser,
    getUserInfo,
    getWorkdays,
    getWorkdayCalendar,
    getOneWorkdayCalendar,
    userCreateCalendar,
    saveUserCalendar,
  }
})

const statusUpdatedMessage = {
  en: 'Status updated',
  ru: 'Статус обновлён',
  uz: 'Holat yangilandi',
  kr: 'Ҳолат янгиланди',
}

const userDeletedMessage = {
  en: 'User deleted',
  ru: 'Пользователь удалён',
  uz: 'Foydalanuvchi o‘chirildi',
  kr: 'Фойдаланувчи ўчирилди',
}

const userUpdatedMessage = {
  en: 'User updated',
  ru: 'Пользователь обновлён',
  uz: 'Foydalanuvchi yangilandi',
  kr: 'Фойдаланувчи янгиланди',
}
const userCelendarUpdatedMessage = {
  en: 'Updated',
  ru: 'обновлён',
  uz: 'Yangilandi',
  kr: 'янгиланди',
}

const userAddedMessage = {
  en: 'User added',
  ru: 'Пользователь добавлен',
  uz: 'Foydalanuvchi qo‘shildi',
  kr: 'Фойдаланувчи қўшилди',
}
