import {
  UsersIcon,
  BuildingLibraryIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  HomeIcon,
  Cog8ToothIcon,
  ChartBarIcon, // ✅ YANGI IMPORT
} from '@heroicons/vue/24/outline'

import { setting } from '../setting/setting'
import { detailSettingMenu } from '../nav/detailSettingMenu'

export const menu = [
  {
    path: '',
    name: 'home',
    component: () => import('@/components/home/homePage.vue'),
    meta: {
      title: {
        en: 'Home',
        ru: 'Главная',
        uz: 'Bosh sahifa',
        kr: 'Бош сахифа',
      },
      icon: HomeIcon,
      group: 'main',
      search: '',
    },
    access: ['admin', 'boss', 'chief', 'observer'],
  },
  {
    path: 'department',
    name: 'department',
    component: () => import('@/components/department/departmentPage.vue'),
    meta: {
      title: {
        en: 'Department',
        ru: 'Отдел',
        uz: "Bo'lim",
        kr: 'Бўлим',
      },
      icon: BuildingLibraryIcon,
      group: 'main',
      search: '',
      access: ['admin', 'boss', 'chief', 'observer'],
    },
  },
  {
    path: 'workers',
    name: 'workers',
    component: () => import('@/components/users/usersPage.vue'),
    meta: {
      title: {
        en: 'Workers',
        ru: 'Сотрудники',
        uz: 'Xodimlar',
        kr: 'Ходимлар',
      },
      icon: UsersIcon,
      group: 'main',
      search: '',
      access: ['admin', 'boss', 'chief', 'observer'],
    },
  },
  {
    path: 'event',
    name: 'event',
    component: () => import('@/components/events/eventPage.vue'),
    meta: {
      title: {
        en: 'Events',
        ru: 'Записи',
        uz: 'Qayd yozuvi',
        kr: 'Қайд ёзуви',
      },
      icon: ClipboardDocumentCheckIcon,
      group: 'main',
      search: '',
      access: ['admin', 'boss', 'chief', 'observer'],
    },
  },

  // ✅ YANGI - STATISTIKA ROUTE
  {
    path: 'statistics',
    name: 'statistics',
    component: () => import('@/views/statistics/StatisticsPage.vue'),
    meta: {
      title: {
        en: 'Statistics',
        ru: 'Статистика',
        uz: 'Statistika',
        kr: 'Статистика',
      },
      icon: ChartBarIcon,
      group: 'main',
      search: '',
      access: ['admin', 'boss', 'observer'],
    },
  },

  {
    path: 'settings/',
    name: 'settings',
    component: () => import('@/setting/settingPage.vue'),
    redirect: { name: 'branch' },
    meta: {
      title: {
        en: 'Settings',
        ru: 'Настройки',
        uz: 'Sozlamalar',
        kr: 'Созламалар',
      },
      icon: Cog8ToothIcon,
      group: 'setting',
      search: '',
      access: ['admin', 'boss', 'observer'],
    },
    children: [...setting, ...detailSettingMenu],
  },
]
