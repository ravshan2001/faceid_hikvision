import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive, computed } from 'vue'

const url = '/branch'
import { notifStore } from '../helpers/notification'

import { loadingStore } from '../helpers/loading'

import { useRouter, useRoute } from 'vue-router'

export const branchStore = defineStore('branchStore', () => {
  const notif = notifStore()
  const loading = loadingStore()
  const router = useRouter()
  const route = useRoute()

  const branch = reactive({
    data: [],
    count: 0,
    limit: 30,
    page: 1,
  })

  const activeBranch = computed(() => {
    return branch.data.filter((item) => item.status)
  })

  const nextBranch = async (limit = 1) => {
    const { data } = await api.get(url, {
      params: {
        limit: limit,
        page: branch.limit,
      },
    })

    if (branch.count >= route?.query?.limit ? route?.query?.limit : branch.limit) {
      branch.data = [
        ...branch.data,
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status,
          }
        }),
      ]
    } else {
      branch.data = [...data.data]
    }
  }

  const changePage = (value) => {
    branch.page = value
    router.push({ name: 'branch', query: { page: branch.page } })
  }

  const allBranch = async (search) => {
    try {
      const { data } = await api.get(url, {
        params: {
          limit: branch.limit,
          page: branch.page,
          title: search,
        },
      })
      // console.log('Branch', data)
      branch.data = [
        ...data.data.map((item) => {
          return {
            ...item,
            status: item.status,
          }
        }),
      ]
      branch.count = data?.count
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const addBranch = async (payload) => {
    try {
      loading.setLoading(true)
      const { data } = await api.post(url, payload)
      // console.log('Created branch', data)
      branch.status = data.status == 'active'
      branch.data = [data, ...branch.data.slice(0, branch.limit - 1)]
      branch.count += 1
      loading.setLoading(false)
      notif.setNotif(true, addedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const saveBranch = async (payload) => {
    try {
      loading.setLoading(true)
      // console.log("ketdi payload", payload);
      
      const { data } = await api.put(`${url}`, payload)
      // console.log('Keldi payload', data)

      branch.data = branch.data?.map((item) => {
        if (item?._id == data?._id)
          return {
            ...data,
            status: data.status == 'active',
          }
        return item
      })
      loading.setLoading(false)
      notif.setNotif(true, updatedMessage, 'success')
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const getBranch = async (id) => {
    try {
      if (!id) return false
      return await api.get(`${url}/${id}`)
    } catch (err) {
      console.warn('Error', err)
    }
  }

  const removeBranch = async (id) => {
    try {
      if (!id) return false
      loading.setLoading(true)
      await api.delete(`${url}/${id}`)
      branch.data = branch.data?.filter((item) => item?._id !== id)
      branch.count -= 1
      loading.setLoading(false)
      notif.setNotif(true, deletedMessage, 'info')
    } catch (err) {
      console.warn('Error Remove', err)
    }
  }

  const statusBranch = async (id) => {
    try {
      if (!id) return false
      const { data } = await api.get(`${url}/status/${id}`)
      // console.log("branchdata", data);

      branch.data = branch.data?.map((item) => {
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
    branch,
    allBranch,
    addBranch,
    saveBranch,
    getBranch,
    removeBranch,
    nextBranch,
    changePage,
    statusBranch,
    activeBranch,
  }
})

const statusUpdatedMessage = {
  en: 'Status updated',
  ru: 'Статус обновлён',
  uz: 'Holat yangilandi',
  kr: 'Ҳолат янгиланди',
}

const deletedMessage = {
  en: 'Branch deleted',
  ru: 'Филиал удалена',
  uz: 'Filial o‘chirildi',
  kr: 'Филиал ўчирилди',
}

const updatedMessage = {
  en: 'Branch updated',
  ru: 'Филиал обновлена',
  uz: 'Filial yangilandi',
  kr: 'Филиал янгиланди',
}

const addedMessage = {
  en: 'Branch added',
  ru: 'Филиал добавлена',
  uz: 'Filial qo‘shildi',
  kr: 'Филиал қўшилди',
}
