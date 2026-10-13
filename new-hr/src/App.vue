<template>
  <notificationPage />
  <router-view />
</template>
<script setup>
  import cookies from 'vue-cookies'
  import notificationPage from './assets/helpers/overlays/notificationPage.vue'
  
  import { socket } from './socket'
  import { onMounted, } from 'vue'
  
  import { notifStore } from '@/stores/helpers/notification'
  const notif = notifStore()

  import { doorStore } from './stores/data/door'
  const door__store = doorStore()
  import { eventStore } from './stores/data/event'
  const event__store = eventStore()
  import { statisticStore } from '@/stores/data/statistic'
  const statistic__store = statisticStore()


  onMounted(async () => {
    // Socket ishlash
    if (cookies.get('access-token')) {
      // Event sinxranizatsiya hodisasi
      socket.on("sync-end", async() => {
        notif.setNotif(true, sinxrEndMessage, 'success')
        console.log('sync-end');
        
      });
      socket.on("doors-status", async(status) => {
        // console.log('Doors status updated:', status);
        door__store.statusDoors = [...status];
      });
      socket.on("new-events", async(count) => {
        console.log('new-events', count.count);
        if(count.count > 0) {
          await event__store.newEventForSocket(count.count)
          await statistic__store.getHomeLastEventsInfo()
        }
      });
      socket.on("sync-status", async(obj) => {
        console.log("sysn-status", obj);
        if(obj.status === 'success') {
          const sendSuccesMessage = {
            en: `${obj?.user?.fullName} добавлен в дверь ${obj?.door?.title}`,
            ru: `${obj?.user?.fullName} добавлен в дверь ${obj?.door?.title}`,
            uz: `${obj?.user?.fullName} добавлен в дверь ${obj?.door?.title}`,
            kr: `${obj?.user?.fullName} добавлен в дверь ${obj?.door?.title}`,
          }
          notif.setNotif(true, sendSuccesMessage, 'success', 5000)
        } else if (obj.status === 'error') {
          const sendErrorMessage = {
            en: `Произошла ошибка при добавлении ${obj?.user?.fullName} к двери ${obj?.door?.title}`,
            ru: `Произошла ошибка при добавлении ${obj?.user?.fullName} к двери ${obj?.door?.title}`,
            uz: `Произошла ошибка при добавлении ${obj?.user?.fullName} к двери ${obj?.door?.title}`,
            kr: `Произошла ошибка при добавлении ${obj?.user?.fullName} к двери ${obj?.door?.title}`,
          }
          notif.setNotif(true, sendErrorMessage, 'danger', 5000)
        } else if (obj.status === 'remove') {
          const sendRemoveMessage = {
            en: `${obj?.user?.fullName}  удален из двери ${obj?.door?.title}`,
            ru: `${obj?.user?.fullName}  удален из двери ${obj?.door?.title}`,
            uz: `${obj?.user?.fullName}  удален из двери ${obj?.door?.title}`,
            kr: `${obj?.user?.fullName}  удален из двери ${obj?.door?.title}`,
          }
          notif.setNotif(true, sendRemoveMessage, 'info', 5000)
        }
      });
    } 
  })

  const sinxrEndMessage = {
    en: 'Synchronization completed.',
    ru: 'Синхронизация завершилась.',
    uz: 'Sinxronizatsiya tugadi.',
    kr: 'Синхронизация тугади.',
  }
</script>
