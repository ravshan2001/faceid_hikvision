import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from '@/i18n/i18n'
import { watch } from 'vue'

import { menu } from './nav/menu'
import { detailMenu } from './nav/detailMenu'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:locale(en|kr|uz)?',
      name: 'defaultLayout',
      component: () => import('@/layouts/defaultLayout.vue'),
      children: [...menu, ...detailMenu],
    },

    {
      path: '/:locale(en|kr|uz)?/auth',
      name: 'authLayout',
      component: () => import('@/layouts/authLayout.vue'),
      redirect: { name: 'login' },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/log/logPage.vue'),
          meta: {
            title: {
              en: 'Login',
              ru: 'Вход',
              uz: 'Tizimga kirish',
              kr: 'Тизимга кириш',
            },
          },
        },
        // {
        //   path: 'registration',
        //   name: 'registration',
        //   component: () => import('@/views/auth/reg/regPage.vue'),
        //   meta: {
        //     title: 'Registration',
        //   },
        // },
      ],
    },

    {
      path: '/:locale(en|kr|uz)?/:catchAll(.*)*',
      name: 'error',
      component: () => import('@/views/error/errorPage.vue'),
      meta: {
        title: {
          en: 'Error',
          ru: 'Ошибка',
          uz: 'Xatolik',
          kr: 'Хатолик',
        },
      },
    },
  ],
})

import cookies from 'vue-cookies'
import { authStore } from '@/stores/admin/auth'

const updateTitle = (to) => {
  const lang = localStorage.getItem('language') || 'ru'
  const pageTitle = to?.meta?.title?.[lang] || 'Default'
  document.title = `Hr | ${pageTitle}`
}

router.beforeEach(async (to, from, next) => {
  let lang = localStorage.getItem('language') || 'ru'
  if (to.params.locale) {
    lang = to.params.locale
    localStorage.setItem('language', lang)
  } else if (lang !== 'ru') {
    return next({ path: `/${lang}${to.fullPath}` })
  }

  updateTitle(to)

  if (!navigator.onLine && to.name !== 'error') {
    return next({ name: 'error' })
  }

  const store = authStore()
  if (['authLayout', 'login'].includes(to?.name)) {
    return next()
  }

  if (store.isAuth) {
    return next()
  }

  const token = cookies.get('access-token')
  if (!token) {
    return next({ name: 'login' })
  }

  try {
    await store.verify()
    return next()
  } catch (err) {
    console.warn('Error', err)
    return next({ name: 'login' })
  }
})

watch(
  () => i18n.global.locale,
  (value) => {
    const currentRoute = router.currentRoute.value

    if (value === 'ru') {
      if (currentRoute.params.locale) {
        router.replace(currentRoute.fullPath.replace(/^\/(en|kr|uz)/, ''))
      }
    } else {
      if (!currentRoute.params.locale || currentRoute.params.locale !== value) {
        router.replace(`/${value}${currentRoute.fullPath.replace(/^\/(en|kr|uz)/, '')}`)
      }
    }
  },
)

export default router
