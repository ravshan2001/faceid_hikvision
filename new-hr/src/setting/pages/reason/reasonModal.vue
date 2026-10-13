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
          :error="v$.shortName.$invalid && v$.shortName.$dirty"
          v-model="data.shortName"
          placeholder="Кратко"
          guide="Выберите краткое название"
          label="Кратко"
          :required="true"
          name="shortName"
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

import { reasonStore } from '@/stores/data/reason'
const store = reasonStore()

import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()

const data = ref({
  title: '',
  shortName: ''
})

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  title: { required },
  shortName: { required },
}
const v$ = useVuelidate(rules, data)

const reset = () => {
  data.value = {
    title: '',
    shortName: '',
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
    const res = await store.getReason(newVal?.id)
    console.log(res.data)

    data.value = {
      ...res.data,
    }
  }
})




const send = async () => {
  try {
    v$.value.$touch()
    const { title, shortName, _id } = data.value

    if (!v$.value.$invalid) {
      
      const payload = {
        title,
        shortName,
      }
      if (!v$.value.$invalid) {
        if (modal_store.modal?.id?.length > 0) {
          await store.saveReason({ _id, ...payload })
        } else {
          await store.addReason(payload)
        }
      }
      close()
    }
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>