import { api } from '../api'

export const statisticsApi = {
  // Dashboard asosiy statistika
  getDashboard: () => {
    return api.get('/statistics/dashboard')
  },

  // Kelmagan xodimlar
  getAbsentEmployees: (params) => {
    return api.get('/statistics/absent-employees', { params })
  },

  // Top xodimlar
  getTopPerformers: (params) => {
    return api.get('/statistics/top-performers', { params })
  },

  // Oylik hisobot
  getMonthlyReport: (params) => {
    return api.get('/statistics/monthly-report', { params })
  },
}
