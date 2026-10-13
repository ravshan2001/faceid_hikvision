import { BuildingStorefrontIcon, BuildingOffice2Icon, GiftIcon, DocumentCheckIcon, LanguageIcon } from '@heroicons/vue/24/outline'
import { detailSettingMenu } from '../nav/detailSettingMenu'
export const setting = [
  // {
  //   path: 'language',
  //   name: 'language',
  //   component: () => import('@/setting/pages/language/languagePage.vue'),
  //   meta: {
  //     title: {
  //       en: 'Language',
  //       ru: 'Язык',
  //       uz: 'Til',
  //       kr: 'Тил',
  //     },
  //     icon: LanguageIcon,
  //     group: 'setting',
  //     search: '',
  //   },
  // },
  {
    path: 'branch',
    name: 'branch',
    component: () => import('@/setting/pages/branch/branchPage.vue'),
    meta: {
      title: {
        en: 'Branches',
        ru: 'Филиалы',
        uz: 'Filiallar',
        kr: 'Филиаллар',
      },
      icon: BuildingOffice2Icon,
      group: 'main',
      search: '',
      access:['admin', 'boss', 'observer'],
    },
  },
  {
    path: 'door',
    name: 'door',
    component: () => import('@/setting/pages/doors/doorPage.vue'),
    meta: {
      title: {
        en: 'Doors',
        ru: 'Двери',
        uz: 'Eshiklar',
        kr: 'Эшиклар',
      },
      icon: BuildingStorefrontIcon,
      group: 'main',
      search: '',
      access:['admin', 'boss', 'observer'],
    },
  },
  {
    path: 'holiday',
    name: 'holiday',
    component: () => import('@/setting/pages/holiday/holidayPage.vue'),
    meta: {
      title: {
        en: 'Holidays',
        ru: 'Праздники',
        uz: 'Bayramlar',
        kr: 'Байрамлар',
      },
      icon: GiftIcon,
      group: 'main',
      search: '',
      access:['admin', 'boss','observer'],
    },
  },
  {
    path: 'reason',
    name: 'reason',
    component: () => import('@/setting/pages/reason/reasonPage.vue'),
    meta: {
      title: {
        en: 'Reason',
        ru: 'Причина',
        uz: 'Sabab',
        kr: 'Сабаб',
      },
      icon: DocumentCheckIcon,
      group: 'main',
      search: '',
      access:['admin', 'boss','observer'],
    },
  },
  
]
