export const detailSettingMenu = [
  {
    path: 'setting/door/:id',
    name: 'detailDoor',
    component: () => import('@/setting/pages/doors/doorDetailPage.vue'),
    meta: {
      title: "Страница двери",
      back:true,
      group: 'detail',
    },
    
  },
  // Users
  
]