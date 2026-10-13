import { defineStore } from 'pinia'
import { api } from '@/helpers/api'
import { reactive } from 'vue'

const url = '/statistic'

export const statisticStore = defineStore('statisticStore', () => {
  const countAllEvent = reactive({})

  const getHomeLastEventsInfo = async () => {
    try {
      const { data } = await api.get(`${url}/home/last-events`)
      if (data) countAllEvent.value = { ...data }
      return data
    } catch (err) {
      console.warn('statistic error', err)
    }
  }

  // Socket dan kelgan eventlarni real-time qabul qilish
  const onLiveEvent = (newEvents) => {
    if (!newEvents?.length) return
    if (!countAllEvent.value) countAllEvent.value = {}

    const enters = newEvents.filter(e => e.action === 'enter')
    const exits  = newEvents.filter(e => e.action === 'exit')

    if (enters.length) countAllEvent.value.lastEnter = enters[0]
    if (exits.length)  countAllEvent.value.lastExit  = exits[0]

    const existing = countAllEvent.value?.lastEvents || []
    const merged = [...newEvents, ...existing]
    const unique = merged.reduce((acc, curr) => {
      if (!acc.find(e => e._id === curr._id)) acc.push(curr)
      return acc
    }, [])
    countAllEvent.value.lastEvents = unique.slice(0, 10)
    countAllEvent.value.came = (countAllEvent.value.came || 0) + newEvents.length
  }

  const getHomeLastInfo = async () => {
    try {
      const { data } = await api.get(`${url}/home/events-count`)
      if (data) countAllEvent.value = { ...data }
    } catch (err) {
      console.warn('statistic error', err)
    }
  }

  return { countAllEvent, getHomeLastEventsInfo, getHomeLastInfo, onLiveEvent }
})
