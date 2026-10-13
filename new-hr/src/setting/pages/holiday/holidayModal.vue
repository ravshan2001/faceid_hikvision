<template>
  <miniModal>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
        <defaultInput
          :error="v$.title.$invalid && v$.title.$dirty"
          v-model="data.title"
          placeholder="Название"
          guide="Введите название"
          label="Название"
          :required="true"
          name="title"
        />
        <defaultInput
          :error="v$.date.$invalid && v$.date.$dirty"
          v-model="data.date"
          type="Date"
          placeholder="Дата"
          guide="Выберите дату"
          label="Дата"
          :required="true"
          name="date"
        />
      </div>

      <div class="flex items-center gap-4 ml-auto mt-4">
        <button type="button" @click="close" class="cancelBtn">
          {{ $t('cancel') }}
        </button>

        <button type="button" @click="send" class="btn">
          {{ $t('add') }}
        </button>
      </div>
    </div>
  </miniModal>
</template>
<script setup>
import miniModal from '@/assets/helpers/overlays/miniModal.vue'
import defaultInput from '@/assets/helpers/others/defaultInput.vue'


import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { holidayStore } from '@/stores/data/holiday'
const store = holidayStore()

import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()

const data = ref({
  title: '',
  date: ''
})

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  title: { required },
  date: { required },
}
const v$ = useVuelidate(rules, data)

const reset = () => {
  data.value = {
    title: '',
    date: '',
  }
  v$.value.$reset()
}

const close = () => {
  reset()
  modal_store.close()
}

watch(modal, async (newVal) => {
  if (!newVal.show) {
    reset()
  }
})

watch(modal, async (newVal) => {
  if (newVal?.id?.length > 0) {
    const res = await store.getHoliday(newVal?.id)
    // console.log(res.data)

    data.value = {
      ...res.data,
      date: res.data.date ? new Date(res.data.date).toISOString().split('T')[0] : '',
    }
  }
})




const send = async () => {
  try {
    v$.value.$touch()
    const { title, date, _id } = data.value

    if (!v$.value.$invalid) {
      
      const payload = {
        title,
        date,
      }
      if (!v$.value.$invalid) {
        if (modal_store.modal?.id?.length > 0) {
          await store.saveHoliday({ _id, ...payload })
        } else {
          await store.addHoliday(payload)
        }
      }
      close()
    }
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>