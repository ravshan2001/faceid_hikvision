export const detailMenu = [
  // Users
  {
    path: 'workers/:id',
    name: 'detailWorker',
    component: () => import('@/components/users/userDetailPage.vue'),
    meta: {
      title: "Страница сотрудника",
      back:true,
      group: 'detail',
    },
    children: [
      {
        path: 'worker-absence',
        name: 'worker-absence',
        component: () => import('@/components/absence/absencePage.vue'),
        meta: {
          active: 'workers',
          group: 'main',
        }
      },
      {
        path: 'worker-statistic',
        name: 'worker-statistic',
        component: () => import('@/components/users/userStatistic.vue'),
        meta: {
          active: 'workers',
          group: 'main',
        }
      },
      {
        path: 'worker-events',
        name: 'worker-events',
        component: () => import('@/components/users/userEventTable.vue'),
        meta: {
          active: 'workers',
          group: 'main',
        }
      },
      {
        path: 'worker-history',
        name: 'worker-history',
        component: () => import('@/components/workerHistory/workerHistoryPage.vue'),
        meta: {
          active: 'workers',
          group: 'main',
          title: {
            en: 'history worker',
            ru: 'история работы',
          }
        }
      },
      {
        path: 'worker-doors',
        name: 'worker-doors',
        component: () => import('@/components/users/userSyncedDoor.vue'),
        meta: {
          active: 'workers',
          group: 'main',
          title: {
            en: 'History doors',
            ru: 'Разрешенные двери',
          }
        }
      },
    ]
  },
  // Users
  
]
