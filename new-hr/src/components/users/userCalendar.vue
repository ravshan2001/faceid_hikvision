<template>
  <div class="lg:flex lg:h-full lg:flex-col">
    <!-- <pre>{{ days }}</pre> -->
    <header class="flex items-center justify-between border-b border-gray-200 py-4 lg:flex-none">
      <h1 class="text-base font-semibold leading-6 text-gray-900">
        <time>{{ calendarTitle }}</time>
      </h1>
      <div class="flex items-center gap-2">
        <select v-model="selectedYear" @change="changeMonth" class="border rounded px-2 py-1">
          <option value="" disabled>Выберите год</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <!-- <option value="holiday">Праздник</option>
            <option value="absence">Отсутствие</option> -->
        </select>
        <select v-model="selectedMonth" @change="changeMonth" class="border rounded px-2 py-1">
          <option value="" disabled>Выберите месяц</option>
          <option v-for="(month, index) in monthNames" :key="index" :value="index">
            {{ month }}
          </option>
        </select>
      </div>
    </header>
    <div class="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
      <div
        class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-100 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none"
      >
        <div class="py-2">Понедельник</div>
        <div class="py-2">Вторник</div>
        <div class="py-2">Среда</div>
        <div class="py-2">Четверг</div>
        <div class="py-2">Пятница</div>
        <div class="py-2">Суббота</div>
        <div class="py-2">Воскресенье</div>
      </div>
      <div class="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
        <div class="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
          <button
            v-for="(day, idx) in days"
            :key="day.date ? day.date + day.day : 'empty-' + idx"
            type="button"
            @click="['admin', 'boss'].includes(user?.role) && openModal(day)"
            :class="[
              day.isCurrentMonth ? getStatusClass(day.dayStatus) : 'bg-gray-50',
              day.isToday && 'font-semibold',
              'flex h-20 flex-col justify-between px-3 py-2 hover:bg-gray-100 focus:z-10 min-h-[90px] text-[11px]',
            ]"
          >
            <div class="flex items-center justify-between">
              <div>
                <GiftIcon v-if="day.dayStatus == 'holiday'" class="w-4" />
                <ExclamationTriangleIcon v-if="day.dayStatus == 'absence'" class="w-5" />
              </div>
              <div>
                <time
                  :datetime="day.date"
                  :class="[
                    day.isToday &&
                      'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white',
                    'ml-auto',
                  ]"
                >
                  {{ day.day }}
                </time>
              </div>
            </div>
            <div>
              <div v-if="day.dayStatus == 'holiday'">
                {{ day.reason }}
              </div>
              <div v-if="day.dayStatus == 'absence'">
                {{ day.reason }}
              </div>
              <div v-if="day.dayStatus == 'weekend'">
                <span>Выходной</span>
              </div>
              <div class="flex items-center justify-between">
                <div v-if="day.events && day.events.length" class="flex flex-col">
                  <div
                    v-for="event in day.events"
                    :key="event?.time"
                    :class="[
                      event.action === 'enter'
                        ? 'text-green-700'
                        : event.action === 'exit'
                          ? 'text-red-600'
                          : 'text-gray-700',
                      'flex items-center gap-1 cursor-pointer leading-4 ',
                    ]"
                  >
                    <!-- {{ day }} -->
                    <span>
                      {{
                        event?.action === 'enter'
                          ? 'Вход'
                          : event?.action === 'exit'
                            ? 'Выход'
                            : event?.action
                      }}
                    </span>
                    <span v-if="event?.time">({{ formatTime(event?.time) }})</span>
                  </div>
                </div>
                <div
                  v-if="day?.workDuration?.hours > 0 && day?.workDuration?.minutes > 0"
                  class="text-[13px]"
                >
                  ~ {{ convertTime(day?.workDuration?.hours, day?.workDuration?.minutes) }}
                </div>
              </div>
              <div
                v-if="
                  day.dayStatus === 'workday' &&
                  day.events.length === 0 &&
                  day.date <= getTodayISO()
                "
                class="flex flex-col"
              >
                Не пришел/а
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
  <VueEasyLightbox :visible="visible" :imgs="[currentImage]" @hide="closeLightbox" />
  <userEventCalendarModal
    v-if="showModal && calendarID"
    :calendarId="calendarID"
    @close="showModal = false"
    @reload="getData"
  />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { userStore } from '@/stores/data/users'
import { doorStore } from '@/stores/data/door'
import { convertTime } from '@/helpers/func'
import { GiftIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import VueEasyLightbox from 'vue-easy-lightbox'
import userEventCalendarModal from '@/components/users/userEventCalendarModal.vue'
import { nextTick } from 'vue'

import { authStore } from '@/stores/admin/auth'
const auth_store = authStore()
const { user } = storeToRefs(auth_store)

const route = useRoute()
const store = userStore()
const door_store = doorStore()
const id = ref('')
const workerCalendar = ref({})
const days = ref([])
const calendarTitle = ref('')
const selectedMonth = ref('')
const selectedYear = ref('2025')

const showModal = ref(false)
const calendarID = ref('')

async function openModal(day) {
  if (!day?.calendarId) {
    const payload = {
      user: id.value,
      date: new Date(day.date).toISOString(),
      shift: 'off',
    }
    // console.log("payload", payload);

    const data = await store.userCreateCalendar(payload)
    // console.log("data", data);

    if (data && data._id) {
      calendarID.value = data._id
      showModal.value = true
      getData()
    } else {
      // fallback: agar calendarId boshqa propertyda bo‘lsa, uni tekshiring
      calendarID.value = data?._id || data?.id || ''
      showModal.value = true
    }
    await nextTick()
    return
  }
  calendarID.value = day.calendarId
  await nextTick()
  showModal.value = true
}

// filterMonth
function changeMonth() {
  // console.log("tanlangan oy",selectedMonth.value);

  getData()
}

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

// Bugungi sanani togri olish uchun (mahalliy vaqtmas, UTCammas, faqat sana)
function getTodayISO() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

// dayStatus bo'yicha rang klassi
function getStatusClass(status) {
  switch (status) {
    case 'workday':
      return 'bg-green-50'
    case 'weekend':
      return 'bg-red-50'
    case 'holiday':
      return 'bg-blue-50'
    case 'absence':
      return 'bg-yellow-50'
    default:
      return ''
  }
}

const fillDays = (data, year, month) => {
  // month - 0-based (0 = yanvar)
  const firstDay = new Date(year, Number(month), 1)
  let startDayOfWeek = firstDay.getDay()
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
  const daysArr = []
  for (let i = 0; i < startDayOfWeek; i++) {
    daysArr.push({
      date: '',
      day: '',
      isCurrentMonth: false,
      dayStatus: '',
      isWorkingDay: false,
      events: [],
      calendarId: '',
      reason: '',
      workDuration: {},
    })
  }
  data.forEach((item) => {
    // item.day - bu 1-based (1,2,3...), month esa 0-based
    const dateObj = new Date(year, month, item.day)
    const yyyy = dateObj.getFullYear()
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
    const dd = String(dateObj.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`
    // console.log("CHECK DATE:", item.day, new Date(year, Number(month), item.day).toDateString())

    daysArr.push({
      date: dateStr,
      day: item?.day,
      isCurrentMonth: true,
      dayStatus: item?.dayStatus,
      isWorkingDay: item?.isWorkingDay,
      events: item?.events || [],
      isToday: dateStr === getTodayISO(),
      reason: item?.reason,
      calendarId: item?.calendarId,
      workDuration: item?.workDuration,
    })
  })
  while (daysArr.length < 42) {
    daysArr.push({
      date: '',
      day: '',
      isCurrentMonth: false,
      dayStatus: '',
      isWorkingDay: false,
      events: [],
      calendarId: '',
      reason: '',
    })
  }
  // console.log("daysArr", daysArr);

  days.value = daysArr
}

const getData = async () => {
  if (!id.value) return
  const params = { _id: id.value }
  if (
    selectedMonth.value !== '' &&
    selectedMonth.value !== null &&
    selectedMonth.value !== undefined
  ) {
    params.month = selectedMonth.value
  }
  if (
    selectedYear.value !== '' &&
    selectedYear.value !== null &&
    selectedYear.value !== undefined
  ) {
    params.year = selectedYear.value
  }
  workerCalendar.value = await store.getWorkdayCalendar(params)
  await door_store.allDoor()
  const { data, year, month } = workerCalendar.value
  if (data && year !== undefined && month !== undefined) {
    fillDays(data, Number(year), Number(month))
    calendarTitle.value = `${monthNames[month]} ${year}`
  }
}

// Lightbox holati
const visible = ref(false)
const currentImage = ref('')

// Lightboxni yopish funksiyasi
const closeLightbox = () => {
  visible.value = false
  currentImage.value = ''
}

watch(
  () => store.reloadCalendar,
  () => {
    getData()
  },
)

onMounted(() => {
  id.value = route.params.id
  getData()
})
</script>

<!-- <template>
  <div class="lg:flex lg:h-full lg:flex-col">
    <header class="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
      <h1 class="text-base font-semibold leading-6 text-gray-900">
        <time datetime="2022-01">15 май 2025</time>
      </h1>
      <div class="flex items-center">
        <div class="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
          <div class="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gray-300" aria-hidden="true" />
          <button type="button" class="flex items-center justify-center rounded-l-md py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50">
            <span class="sr-only">Previous month</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" class="hidden px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block">Today</button>
          <span class="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
          <button type="button" class="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50">
            <span class="sr-only">Next month</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
    <div class="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
      <div class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
        <div class="py-2">Понедельник</div>
        <div class="py-2">Вторник</div>
        <div class="py-2">Среда</div>
        <div class="py-2">Четверг</div>
        <div class="py-2">Пятница</div>
        <div class="py-2">Суббота</div>
        <div class="py-2">Воскресенье</div>
      </div>
      <div class="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
        <div class="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
          <div v-for="day in days" :key="day.date" :class="[day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500', 'relative px-3 py-2']">
            <time :datetime="day.date" :class="day.isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white' : undefined">{{ day.date.split('-').pop().replace(/^0/, '') }}</time>
            <ol v-if="day.events.length > 0" class="mt-2">
              <li v-for="event in day.events.slice(0, 2)" :key="event.id">
                <a :href="event.href" class="group flex">
                  <p class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
                    {{ event.name }}
                  </p>
                  <time :datetime="event.datetime" class="ml-3  flex-none text-gray-500 group-hover:text-indigo-600 xl:block">{{ event.time }}</time>
                </a>
              </li>
              <li v-if="day.events.length > 2" class="text-gray-500">+ {{ day.events.length - 2 }} more</li>
            </ol>
          </div>
        </div>
        <div class="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
          <button 
            v-for="day in days" 
            :key="day.date" 
            type="button" 
            :class="[day.isCurrentMonth ? 'bg-white' : 'bg-gray-50', (day.isSelected || day.isToday) && 'font-semibold', day.isSelected && 'text-white', !day.isSelected && day.isToday && 'text-indigo-600', !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900', !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-500', 'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10']"
          >
            <time :datetime="day.date" :class="[day.isSelected && 'flex h-6 w-6 items-center justify-center rounded-full', day.isSelected && day.isToday && 'bg-indigo-600', day.isSelected && !day.isToday && 'bg-gray-900', 'ml-auto']">
              {{ day.date.split('-').pop().replace(/^0/, '') }}
            </time>
            <span class="">{{ day.events.length }} events</span>
            <span v-if="day.events.length > 0" class="-mx-0.5 mt-auto flex flex-wrap-reverse">
              <span v-for="event in day.events" :key="event.id" class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
            </span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="selectedDay?.events.length > 0" class="px-4 py-10 sm:px-6">
      <ol class="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
        <li v-for="event in selectedDay.events" :key="event.id" class="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
          <div class="flex-auto">
            <p class="font-semibold text-gray-900">{{ event.name }}</p>
            <time :datetime="event.datetime" class="mt-2 flex items-center text-gray-700">
              <ClockIcon class="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              {{ event.time }}
            </time>
          </div>
          <a :href="event.href" class="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100"
            >Edit<span>, {{ event.name }}</span></a
          >
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/vue/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
import { userStore } from '@/stores/data/users'
const store = userStore()
const id = ref('')
const workerCalendar = ref({})

const days = [
  { date: '2021-12-27', events: [] },
  { date: '2021-12-28', events: [] },
  { date: '2021-12-29', events: [] },
  { date: '2021-12-30', events: [] },
  { date: '2021-12-31', events: [] },
  { date: '2022-01-01', isCurrentMonth: true, events: [] },
  { date: '2022-01-02', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-03',
    isCurrentMonth: true,
    events: [
      { id: 1, name: 'Design review', time: '10AM', datetime: '2022-01-03T10:00', href: '#' },
      { id: 2, name: 'Sales meeting', time: '2PM', datetime: '2022-01-03T14:00', href: '#' },
    ],
  },
  { date: '2022-01-04', isCurrentMonth: true, events: [] },
  { date: '2022-01-05', isCurrentMonth: true, events: [] },
  { date: '2022-01-06', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-07',
    isCurrentMonth: true,
    events: [{ id: 3, name: 'Date night', time: '6PM', datetime: '2022-01-08T18:00', href: '#' }],
  },
  { date: '2022-01-08', isCurrentMonth: true, events: [] },
  { date: '2022-01-09', isCurrentMonth: true, events: [] },
  { date: '2022-01-10', isCurrentMonth: true, events: [] },
  { date: '2022-01-11', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-12',
    isCurrentMonth: true,
    isToday: true,
    events: [{ id: 6, name: "Sam's birthday party", time: '2PM', datetime: '2022-01-25T14:00', href: '#' }],
  },
  { date: '2022-01-13', isCurrentMonth: true, events: [] },
  { date: '2022-01-14', isCurrentMonth: true, events: [] },
  { date: '2022-01-15', isCurrentMonth: true, events: [] },
  { date: '2022-01-16', isCurrentMonth: true, events: [] },
  { date: '2022-01-17', isCurrentMonth: true, events: [] },
  { date: '2022-01-18', isCurrentMonth: true, events: [] },
  { date: '2022-01-19', isCurrentMonth: true, events: [] },
  { date: '2022-01-20', isCurrentMonth: true, events: [] },
  { date: '2022-01-21', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-22',
    isCurrentMonth: true,
    // isSelected: true,
    events: [
      { id: 4, name: 'Maple syrup museum', time: '3PM', datetime: '2022-01-22T15:00', href: '#' },
      { id: 5, name: 'Hockey game', time: '7PM', datetime: '2022-01-22T19:00', href: '#' },
    ],
  },
  { date: '2022-01-23', isCurrentMonth: true, events: [] },
  { date: '2022-01-24', isCurrentMonth: true, events: [] },
  { date: '2022-01-25', isCurrentMonth: true, events: [] },
  { date: '2022-01-26', isCurrentMonth: true, events: [] },
  { date: '2022-01-27', isCurrentMonth: true, events: [] },
  { date: '2022-01-28', isCurrentMonth: true, events: [] },
  { date: '2022-01-29', isCurrentMonth: true, events: [] },
  { date: '2022-01-30', isCurrentMonth: true, events: [] },
  { date: '2022-01-31', isCurrentMonth: true, events: [] },
  { date: '2022-02-01', events: [] },
  { date: '2022-02-02', events: [] },
  { date: '2022-02-03', events: [] },
  {
    date: '2022-02-04',
    events: [{ id: 7, name: 'Cinema with friends', time: '9PM', datetime: '2022-02-04T21:00', href: '#' }],
  },
  { date: '2022-02-05', events: [] },
  { date: '2022-02-06', events: [] },
]
const selectedDay = days.find((day) => day.isSelected)



const getData = async () => {
  if (!id.value) return false
  workerCalendar.value = await store.getWorkdayCalendar({_id: id.value})
  console.log("workercalendar", workerCalendar.value);
}

onMounted(() => {
  id.value = route.params.id
  getData()
})

</script> -->
