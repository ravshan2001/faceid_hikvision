import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive, computed } from 'vue'

const url = '/department'
import { notifStore } from '../helpers/notification'

import { loadingStore } from '../helpers/loading'

import { useRouter, useRoute } from 'vue-router'

export const departmentStore = defineStore('departmentStore', () => {
  const loading = loadingStore()
  const notif = notifStore()
  const router = useRouter()
  const route = useRoute()

  const department = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,

    parent: [],
  })

  const activeDepartment = computed(() => {
    return department.data.filter((item) => item.status)
  })

  const getParent = async () => {
    try {
      const { data } = await api.get(url, {
        
      })
      // console.log('Parent', data)

      department.parent = [...data.data]
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const nextDepartment = async (limit = 1) => {
    const { data } = await api.get(url, {
      params: {
        limit: limit,
        page: department.limit,
      },
    })
    // console.log('NEXT', data)

    if (department.count >= route?.query?.limit ? route?.query?.limit : department.limit) {
      department.data = [
        ...department.data,
        ...data.data.map((item) => {
          return { ...item, status: item.status }
        }),
      ]
    } else {
      department.data = [...data.data]
    }
  }

  const changePage = (value) => {
    department.page = value
    router.push({ name: 'department', query: { page: department.page } })
  }

  const allDepartment = async ( search) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: department.limit,
          page: department.page,
          name: search,
        },
      })
      // console.log('Department', data)
      department.data = [
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status,
          }
        }),
      ]
      department.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addDepartment = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)
      // console.log('Created Department', data)
      data.status = data.status == 'active'
      department.data = [data, ...department.data.slice(0, department.limit - 1)]
      department.count += 1
      loading.setLoading(false)
      notif.setNotif(true, departmentAddedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveDepartment = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.put(`${url}`, payload)
      console.log('Save Department', data)

      department.data = department.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data?.status
          }
        return item
      })
      loading.setLoading(false)
      notif.setNotif(true, departmentUpdatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getDepartment = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const removeDepartment = async (id) => {
    try {
      if (!id) return false
      loading.setLoading(true)
      await api.delete(`${url}/${id}`)
      department.data = department.data?.filter((item) => item?._id !== id)
      department.count -= 1
      loading.setLoading(false)
      notif.setNotif(true, departmentDeletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }

  const statusDepartment = async (id) => {
    try {
      if (!id) return false
      const { data } = await api.get(`${url}/status/${id}`)

      department.data = department.data?.map((item) => {
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
    department,
    activeDepartment,
    allDepartment,
    addDepartment,
    saveDepartment,
    getDepartment,
    removeDepartment,
    statusDepartment,
    getParent,
    nextDepartment,
    changePage,
  }
})

const statusUpdatedMessage = {
  en: 'Status updated',
  ru: 'Статус обновлён',
  uz: 'Holat yangilandi',
  kr: 'Ҳолат янгиланди',
}

const departmentDeletedMessage = {
  en: 'Department deleted',
  ru: 'Отдел удалён',
  uz: 'Bo‘lim o‘chirildi',
  kr: 'Бўлим ўчирилди',
}

const departmentUpdatedMessage = {
  en: 'Department updated',
  ru: 'Отдел обновлён',
  uz: 'Bo‘lim yangilandi',
  kr: 'Бўлим янгиланди',
}

const departmentAddedMessage = {
  en: 'Department added',
  ru: 'Отдел добавлен',
  uz: 'Bo‘lim qo‘shildi',
  kr: 'Бўлим қўшилди',
}
