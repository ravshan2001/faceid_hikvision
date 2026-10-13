<template>
  <div class="space-y-1">
    <div class="block text-sm font-medium text-changeText ml-1">
      {{ label }}
      <span v-if="required" class="text-sm text-red-500 font-medium">*</span>
    </div>

    <div class="relative">
      <label
        :for="name"
        :class="[
          'block py-7 px-10 rounded-xl border-2 border-dashed h-[176px] cursor-pointer hover:border-aside',
          isDragging ? 'border-aside' : 'border-border',
          model?.length > 0 ? 'sm:p-4' : '',
          error ? '!border-red-500' : '',
        ]"
        @dragover.prevent="onDragOver"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop"
      >
        <div
          class="flex flex-col items-center justify-center h-full"
          v-if="!model?.length > 0 && !loading"
        >
          <svg
            class="w-8 h-8 mb-4 text-changeText"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p class="mb-2 text-sm text-changeText">
            <span class="font-semibold">{{ uploadMessage[locale] }}</span>
            {{ uploadMessageText[locale] }}
          </p>
          <p class="text-xs text-changeText/50">{{ fileFormatMessage[locale] }}</p>
        </div>

        <div v-if="model?.length > 0 && !loading" class="flex items-center gap-4 h-full">
          <div class="w-28 h-full overflow-hidden sm:h-28 flex-shrink-0">
            <img
              :src="`${url}/${model}`"
              alt=""
              v-if="model?.length > 0"
              class="w-full h-full object-contain object-center"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="space-y-4">
              <h1 class="md:w-[50ch] sm:!w-[20ch] truncate text-mainText font-medium">
                {{ fileName }}
              </h1>
              <p class="text-mainText">{{ fileSize.toFixed(2) }} {{ mbMessage[locale] }}</p>
            </div>
          </div>
        </div>
      </label>

      <input
        @change="onFileChange"
        ref="fileInput"
        accept=".png, .jpg"
        class="hidden"
        :name="name"
        type="file"
        :id="name"
        multiple
      />

      <button
        v-if="model?.length > 0"
        type="button"
        @click.stop="removeFile"
        :class="[
          'absolute right-10 transform -translate-y-1/2 top-1/2 sm:right-4 sm:top-4 sm:translate-y-0',
          'p-2 rounded-md bg-red-500 hover:bg-red-400',
        ]"
      >
        <TrashIcon class="relative z-20 w-6 h-6 text-whiteText" />
      </button>

      <div
        :class="[
          'absolute rounded-xl inset-0 mx-auto flex items-center justify-center z-[900] bg-blur/50',
        ]"
        v-if="loading"
      >
        <div class="flex justify-center items-center py-4 z-50">
          <div
            class="animate-spin border-l-mainText size-7 rounded-full border-4 border-dotted border-aside"
          />
        </div>
      </div>

      <span
        :class="[
          'absolute transform text-sm text-red-500',
          'left-1',
          error ? 'transition duration-100 translate-y-0' : 'opacity-0 -translate-y-5',
        ]"
      >
        {{ guide }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { TrashIcon } from '@heroicons/vue/24/outline'

import { ref } from 'vue'
import { url } from '@/helpers/api'
import axios from 'axios'
import cookies from 'vue-cookies'

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()

const token = cookies.get('access-token')

const props = defineProps({
  label: { type: String, required: true },
  required: { type: Boolean, required: false },
  name: { type: String, required: true },
  placeholder: { type: String, required: false },
  folder: { type: String, required: true },
  error: {
    type: Boolean,
    required: false,
  },
  guide: {
    type: String,
    required: false,
  },
})

const model = defineModel()
const fileName = ref('')
const fileSize = ref(0)
const isDragging = ref(false)
const fileInput = ref()
const MAX_FILE_SIZE = 200 * 1024

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event) => {
  isDragging.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const validTypes = ['image/png', 'image/jpeg']
    const invalidFiles = Array.from(files).filter((file) => !validTypes.includes(file.type))

    if (invalidFiles.length > 0) {
      notif.setNotif(true, fileRestrictionMessage, 'danger')
      removeFile()
      return
    }

    onFileChange({ target: { files } })
  }
}

const onFileChange = (event) => {
  try {
    const file = event.target.files[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        notif.setNotif(true, fileSizeMessage, 'danger')
        removeFile()
        return
      }
      fileName.value = file?.name
      fileSize.value = file?.size / 1024 / 1024
      uploadFile(file)
    }
  } catch (err) {
    console.warn('Error Event', err)
  }
}

const uploadFile = async (file) => {
  try {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await axios.post(`${url}/upload/photo/${props.folder}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    model.value = data
    setLoading(false)
  } catch (err) {
    console.warn('Upload', err)
  }
}

const removeFile = () => {
  // console.log('Removed')
  model.value = ''
  fileName.value = ''
  fileSize.value = 0

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Loading
const loading = ref(false)

const setLoading = (value) => {
  loading.value = value
}

// LANGUAGE
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const fileFormatMessage = {
  en: 'PNG, JPG (MAX. 200KB)',
  ru: 'PNG, JPG (МАКС. 200КБ)',
  uz: 'PNG, JPG (MAKS. 200KB)',
  kr: 'PNG, JPG (МАКС. 200КБ)',
}

const uploadMessage = {
  en: 'Click to upload',
  ru: 'Нажмите для',
  uz: 'Yuklash uchun bosing',
  kr: 'Юклаш учун босинг',
}

const uploadMessageText = {
  en: 'or drag and drop',
  ru: 'или перетащите файл',
  uz: 'yoki sudrab olib keling',
  kr: 'ёки судраб олиб келинг',
}

const mbMessage = {
  en: 'MB',
  ru: 'МБ',
  uz: 'MB',
  kr: 'МБ',
}

const fileRestrictionMessage = {
  en: 'Only PNG and JPG files are allowed!',
  ru: 'Разрешены только файлы PNG и JPG!',
  uz: 'Faqat PNG va JPG fayllar ruxsat etiladi!',
  kr: 'Фақат PNG ва JPG файллар рухсат этилади!',
}

const fileSizeMessage = {
  en: 'File size must not exceed 200KB!',
  ru: 'Размер файла не должен превышать 200KB!',
  uz: 'Fayl hajmi 200KB dan oshmasligi kerak!',
  kr: 'Файл ҳажми 200KB дан ошмаслиги керак!',
}
</script>
