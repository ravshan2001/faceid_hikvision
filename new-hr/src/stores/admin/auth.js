import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/helpers/api'
import cookies from 'vue-cookies'

import router from '@/router'
import { notifStore } from '../helpers/notification'

export const authStore = defineStore('authStore', () => {
  const notif = notifStore()

  const user = ref({})
  const isAuth = ref(false)

  const refreshAccessToken = async () => {
    try {
      const refreshToken = cookies.get('refresh-token')

      if (!refreshToken) {
        router.push({ name: 'login' })
        console.warn('Refresh-token is not available!')
        return
      }

      const { data } = await api.post('/auth/refresh-access-token', {
        refreshToken: refreshToken,
      })

      // console.log('Refresh-Token', data)
      const newAccessToken = data?.accessToken
      cookies.set('access-token', newAccessToken, '7d')
      user.value = { ...data.user }
      // console.log('Access Token updated')
    } catch (err) {
      console.warn('Error', err)
      router.push({ name: 'login' })
    }
  }

  let refreshinterval = null
  const refreshTimer = () => {
    refreshinterval = setTimeout(
      async () => {
        await refreshAccessToken()
        refreshTimer()
      },
      7 * 24 * 60 * 60 * 1000,
    )
  }

  const login = async (payload) => {
    // console.log('Payload', payload)

    try {
      const { data } = await api.post('/auth/login', payload)
      // console.log('DATA', data?.user)

      cookies.set('access-token', data?.accessToken)
      cookies.set('refresh-token', data?.refreshToken)

      user.value = { ...data?.user }
      isAuth.value = true
      router.push({ name: 'home' })

      notif.setNotif(true, loggedInMessage, 'success')
      refreshTimer()
    } catch (err) {
      console.warn('Error Login', err)

      const errorMessage = err?.response?.data?.message

      if (messages[errorMessage]) {
        notif.setNotif(true, messages[errorMessage], 'warning')
      }
    }
  }

  const verify = async () => {
    try {
      await refreshAccessToken()
      // console.log('Check User')
      const { data } = await api.get('/auth/verify')
      // console.log('Verify', data)
      user.value = { ...data?.user }
      isAuth.value = true
      refreshTimer()
    } catch (err) {
      if ([401, 403].includes(err?.response?.status)) {
        router?.push({ name: 'login' })
      }
      console.warn('Error Check User', err)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('theme')
      cookies.remove('access-token')
      cookies.remove('refresh-token')
      isAuth.value = false
      clearTimeout(refreshinterval)
      router.push({ name: 'login' })
      notif.setNotif(true, loggedOutMessage, 'info')
      localStorage.removeItem('language')
    } catch (err) {
      console.warn('Error Log out', err)
    }
  }

  return {
    user,
    isAuth,
    login,
    logout,
    verify,
    refreshAccessToken,
  }
})

const loggedOutMessage = {
  en: 'You have logged out!',
  ru: 'Вы вышли из системы!',
  uz: 'Tizimdan chiqdingiz!',
  kr: 'Тизимдан чиқдингиз!',
}

const loggedInMessage = {
  en: 'You have successfully logged in!',
  ru: 'Вы успешно вошли в систему!',
  uz: 'Tizimga muvaffaqiyatli kirdingiz!',
  kr: 'Тизимга муваффақиятли кирдингиз!',
}

const messages = {
  'Номер телефона должен соответствовать формату 998 (XX) XXX-XX-XX.': {
    en: 'Only phone numbers starting with 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50, or 77 are allowed.',
    ru: 'Номер телефона должен начинаться с 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50 или 77.',
    uz: 'Telefon raqami faqat 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50 yoki 77 bilan boshlanishi kerak.',
    kr: 'Телефон рақами фақат 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50 ёки 77 билан бошланиши керак.',
  },
  'Пароль должен содержать минимум 5 символов.': {
    en: 'The password must contain at least 5 characters.',
    ru: 'Пароль должен содержать минимум 5 символов.',
    uz: 'Parol kamida 5 ta belgi bo‘lishi kerak.',
    kr: 'Парол камида 5 та белги бўлиши керак.',
  },
  'Пользователь не найден!': {
    en: 'User not found!',
    ru: 'Пользователь не найден!',
    uz: 'Foydalanuvchi topilmadi!',
    kr: 'Фойдаланувчи топилмади!',
  },
  'Неверный пароль!': {
    en: 'Invalid password!',
    ru: 'Неверный пароль!',
    uz: 'Noto‘g‘ri parol!',
    kr: 'Нотўғри парол!',
  },
}
