import '@/styles/app.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'


import App from './App.vue'
import router from './router'
import { i18n } from './i18n/i18n'
import { MotionPlugin } from '@vueuse/motion'
import VueApexCharts from 'vue3-apexcharts'


import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)
// const pinia = createPinia()


app.component('VueDatePicker', VueDatePicker)
app.use(i18n)
app.use(VueCookies, { expires: '7d' })
app.use(MotionPlugin)
app.use(VueApexCharts)
app.use(router)
app.use(createPinia())

app.mount('#app')
