import { defineStore } from 'pinia'
import { ref } from 'vue'
import { statisticsApi } from '@/helpers/api/statistics'

export const useStatisticsStore = defineStore('statistics', () => {
  // State
  const dashboardData = ref(null)
  const absentEmployees = ref([])
  const topPerformers = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const fetchDashboard = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await statisticsApi.getDashboard()
      if (response.data.success) {
        dashboardData.value = response.data.data
      }
    } catch (err) {
      error.value = err.message || 'Ma\'lumot yuklanmadi'
      console.error('Dashboard error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAbsentEmployees = async (params) => {
    loading.value = true
    error.value = null
    try {
      const response = await statisticsApi.getAbsentEmployees(params)
      if (response.data.success) {
        absentEmployees.value = response.data.data.employees
      }
    } catch (err) {
      error.value = err.message
      console.error('Absent employees error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchTopPerformers = async (params) => {
    loading.value = true
    error.value = null
    try {
      const response = await statisticsApi.getTopPerformers(params)
      if (response.data.success) {
        topPerformers.value = response.data.data.topPerformers
      }
    } catch (err) {
      error.value = err.message
      console.error('Top performers error:', err)
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    dashboardData.value = null
    absentEmployees.value = []
    topPerformers.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    dashboardData,
    absentEmployees,
    topPerformers,
    loading,
    error,
    // Actions
    fetchDashboard,
    fetchAbsentEmployees,
    fetchTopPerformers,
    resetState,
  }
})
