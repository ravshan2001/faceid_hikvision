<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 transition-opacity bg-blur" />
      </TransitionChild>

      <div class="fixed inset-0 z-10">
        <div class="flex h-screen justify-center text-center items-center sm:items-start p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform rounded-lg px-4 py-5 text-left shadow-xl transition-all w-full max-w-2xl bg-modal h-fit max-h-[80%] overflow-y-auto mainScroll"
            >
              <div class="absolute right-0 top-0 pr-4 pt-4 block">
                <button
                  type="button"
                  class="rounded-md focus:outline-none text-mainText"
                  @click="handleClose"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="size-6" aria-hidden="true" />
                </button>
              </div>

              <DialogTitle
                as="h3"
                class="text-changeText text-2xl font-bold leading-normal mb-4 min-h-[36px] sm:min-h-[30px]"
              >
                Календарь
              </DialogTitle>
              <div class="flex flex-col gap-4">
                <div v-if="loading">Yuklanmoqda...</div>
                <div
                  v-else-if="calendarData && Object.keys(calendarData).length > 0"
                  class="flex flex-col gap-2 p-4"
                >
                  <div
                    class="mb-2 gap-2 flex"
                    v-if="
                      calendarData.dayStatus == 'workday' || calendarData.dayStatus == 'weekend'
                    "
                  >
                    <label class="text-lg text-gray-500 2xl:text-[14px]">Статус дня:</label>
                    <select v-model="selectedStatus" class="border rounded px-2 py-1">
                      <option value="workday">Рабочий день</option>
                      <option value="weekend">Выходной</option>
                      <!-- <option value="holiday">Праздник</option>
                      <option value="absence">Отсутствие</option> -->
                    </select>
                    <!-- <button class="ml-2 btn" @click="updateStatus">Сохранить</button> -->
                  </div>
                  <div
                    class="mb-2 flex gap-4"
                    v-if="
                      calendarData.dayStatus == 'absence' || calendarData.dayStatus == 'holiday'
                    "
                  >
                    <div class="text-lg text-gray-500 2xl:text-[14px]">Статус дня:</div>
                    <div class="text-xl font-medium text-mainText 2xl:text-[16px]">
                      {{ calendarData.dayStatus == 'holiday' ? 'Праздник' : 'Отсутствие' || '-' }}
                    </div>
                  </div>
                  <div class="mb-2 flex gap-4">
                    <div class="text-lg text-gray-500 2xl:text-[14px]">Причина:</div>
                    <div class="text-xl font-medium text-mainText 2xl:text-[16px]">
                      {{ calendarData.reason || '-' }}
                    </div>
                  </div>
                  <div class="mb-2 flex gap-4">
                    <div class="text-lg text-gray-500 2xl:text-[14px]">Пришел:</div>
                    <div class="text-xl font-medium text-mainText 2xl:text-[16px]">
                      {{ formatTime(calendarData.arrival) || '-' }}
                    </div>
                  </div>
                  <div class="mb-2 flex gap-4">
                    <div class="text-lg text-gray-500 2xl:text-[14px]">Ушел:</div>
                    <div class="text-xl font-medium text-mainText 2xl:text-[16px]">
                      {{ formatTime(calendarData.departure) || '-' }}
                    </div>
                  </div>
                  <div class="mb-2 flex gap-4">
                    <div class="text-lg text-gray-500 2xl:text-[14px]">Продолжительность:</div>
                    <div class="text-xl font-medium text-mainText 2xl:text-[16px]">
                      {{
                        calendarData.workDuration
                          ? `${calendarData.workDuration.hours}ч ${calendarData.workDuration.minutes}м`
                          : '-'
                      }}
                    </div>
                  </div>
                  <!-- Events -->
                  <div class="mb-2 flex gap-4">
                    <span class="text-lg text-gray-500 2xl:text-[14px]">События:</span>
                    <div>
                      <div v-if="calendarData.events && calendarData.events.length">
                        <ul class="list-disc ml-6">
                          <li
                            v-for="(event, idx) in calendarData.events"
                            :key="idx"
                            class="mb-2"
                            :class="
                              event?.action === 'exit'
                                ? 'text-redColor'
                                : event?.action === 'enter'
                                  ? 'text-greenColor'
                                  : ''
                            "
                          >
                            {{
                              event.action === 'enter'
                                ? 'Вход'
                                : event.action === 'exit'
                                  ? 'Выход'
                                  : event.action
                            }}
                            <span v-if="event.time">({{ formatTime(event.time) }})</span>
                            <span v-if="event.pictureURL">
                              <img
                                :src="getImageUrl(event.pictureURL)"
                                alt="event"
                                class="inline w-8 h-8 ml-2 rounded cursor-pointer"
                                @click="openLightbox(event?.pictureURL)"
                              />
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <button class="btn" @click="addEventForm">+ Добавить событие</button>
                        <div
                          v-for="(event, idx) in eventForms"
                          :key="idx"
                          class="mt-2 flex gap-2 items-center"
                        >
                          <select v-model="event.door" class="w-full border rounded px-2 py-1">
                            <option value="" disabled>Выберите двери</option>
                            <option
                              v-for="door in door_store.activeDoors"
                              :key="door._id"
                              :value="door._id"
                            >
                              {{ door?.branch?.title || '' }} - {{ door?.title || '' }}
                            </option>
                          </select>
                          <select v-model="event.action" class="border rounded px-2 py-1">
                            <option value="enter">Вход</option>
                            <option value="exit">Выход</option>
                          </select>
                          <input
                            type="datetime-local"
                            v-model="event.time"
                            class="border rounded px-2 py-1"
                          />
                          <button class="cancelBtn" @click="removeEventForm(idx)">Удалить</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>Ma'lumot topilmadi.</div>
                <div class="flex items-center gap-4 ml-auto mt-4">
                  <button type="button" @click="handleClose" class="cancelBtn">Отмена</button>
                  <button type="button" @click="saveEvents" class="btn">Сохранить</button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <VueEasyLightbox :visible="visible" :imgs="[currentImage]" @hide="closeLightbox" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { userStore } from '@/stores/data/users'
import { eventStore } from '@/stores/data/event'
import { convertDateShort } from '@/helpers/func'
import getSelect from '@/assets/helpers/others/getSelect.vue'

import { url } from '@/helpers/api'
import { doorStore } from '@/stores/data/door'
import VueEasyLightbox from 'vue-easy-lightbox'
const store = userStore()
const event_store = eventStore()
const door_store = doorStore()
import { nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps({
  show: { type: Boolean, default: true },
  calendarId: { type: String, required: true },
})
const emit = defineEmits(['close', 'reload'])

const calendarData = ref(null)
const loading = ref(false)
const selectedStatus = ref('')
const eventForms = ref([])

function handleClose() {
  emit('close')
}

function send() {
  emit('close')
}

function getImageUrl(path) {
  return path ? `${url}/${path}` : ''
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

async function fetchCalendarData(id) {
  if (!id) {
    calendarData.value = null
    return
  }
  loading.value = true
  const data = await store.getOneWorkdayCalendar(id)
  // console.log("dataTanlangan", data);

  calendarData.value = { ...data }
  if (data.dayStatus === 'workday' || data.dayStatus === 'weekend') {
    selectedStatus.value = data.dayStatus
  } else {
    selectedStatus.value = ''
  }

  loading.value = false
}

function addEventForm() {
  eventForms.value.push({ action: 'enter', door: '', time: '' })
}

function removeEventForm(idx) {
  eventForms.value.splice(idx, 1)
}

async function saveEvents() {
  // Faqat qiymati borlarini yuborish
  const validEvents = eventForms.value.filter((e) => e.action && e.time)
  if (!props.calendarId) return
  loading.value = true
  try {
    await store.saveUserCalendar({
      _id: calendarData.value.calendarId,
      user: route.params.id,
      shift: selectedStatus.value == 'weekend' ? 'off' : 'full_day',
    })
    console.log(validEvents)
    if (validEvents.length) {
      for (const event of validEvents) {
        console.log({
          type: 'face',
          action: event.action,
          time: `${event.time}+05:00`,
          door: event.door,
          user: route.params.id,
        })
        await event_store.addCalendarEvent({
          type: 'face',
          action: event.action,
          time: `${event.time}+05:00`,
          door: event.door,
          user: route.params.id,
        })
      }
      eventForms.value = []
    }
    emit('reload')
    emit('close')
  } finally {
    loading.value = false
  }
}

watch(
  () => props.calendarId,
  async (newId) => {
    await fetchCalendarData(newId)
    await nextTick()
  },
  { immediate: true },
)

// Lightbox holati
const visible = ref(false)
const currentImage = ref('')

// Lightboxni yopish funksiyasi
const closeLightbox = () => {
  visible.value = false
  currentImage.value = ''
}

// Lightboxni ochish funksiyasi
const openLightbox = (imageUrl) => {
  currentImage.value = `${url}/${imageUrl}`
  visible.value = true
}
</script>
