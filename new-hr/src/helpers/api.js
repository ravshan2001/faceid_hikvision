import axios from 'axios'
import cookies from 'vue-cookies'
const url = import.meta.env.VITE_URL

const api = axios.create({
  baseURL: url,
  headers: {
    'Content-type': 'application/json',
  },
  // timeout: 2000,
})

api.interceptors.request.use(
  (config) => {
    const token = cookies.get('access-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
    // return console.warn('Error API', error)
  },
)

export { api, url }
