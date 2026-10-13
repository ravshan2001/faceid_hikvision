<template>
  <miniModal>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
        <defaultSelect
          :error="v$.reason.$invalid && v$.reason.$dirty"
          :guide="`причину ${$t('empty')}`"
          v-model="data.reason"
          label="Причина"
          placeholder="Выберите причину"
          :option="reason_store.activeReasons"
          name="reason"
          :required="true"
          title="title"
        />
        <defaultInput
          :error="v$.title.$invalid && v$.title.$dirty"
          v-model="data.title"
          placeholder="Заголовок"
          guide="Введите Заголовок"
          label="Заголовок"
          :required="true"
          name="title"
        />
        <defaultTextArea
          v-model="data.description"
          placeholder="Описание"
          guide="Введите Описание"
          label="Описание"
          :required="true"
          name="description"
        />
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
        <defaultInput
          :error="v$.start.$invalid && v$.start.$dirty"
          v-model="data.start"
          type="Date"
          placeholder="От"
          guide="Выберите дату"
          label="От"
          :required="true"
          name="start"
        />
        <defaultInput
          :error="v$.end.$invalid && v$.end.$dirty"
          v-model="data.end"
          type="Date"
          placeholder="До"
          guide="Выберите дату"
          label="До"
          :required="true"
          name="end"
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
import defaultSelect from '@/assets/helpers/others/defaultSelect.vue'
import defaultTextArea from '@/assets/helpers/others/defaultTextarea.vue'

import { useRoute } from 'vue-router'
const route = useRoute()

import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { absenceStore } from '@/stores/data/absence'
const store = absenceStore()

import { reasonStore } from '@/stores/data/reason'
const reason_store = reasonStore()

import { userStore } from '@/stores/data/users'
const user_store = userStore()


import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()

const data = ref({
  reason: '',
  title: '',
  description: '',
  start: '',
  end: ''
})

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  reason: { required },
  title: { required },
  start: { required },
  end: { required },
}
const v$ = useVuelidate(rules, data)

const reset = () => {
  data.value = {
    reason: '',
    title: '',
    description: '',
    start: '',
    end: ''
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
    const res = await store.getAbsence(newVal?.id)
    // console.log(res.data)

    data.value = {
      ...res.data,
      start: res.data.start ? new Date(res.data.start).toISOString().split('T')[0] : '',
      end: res.data.end ? new Date(res.data.end).toISOString().split('T')[0] : '',
    }
  }
})




const send = async () => {
  try {
    v$.value.$touch()
    const { reason, title, description, start, end, _id } = data.value

    if (!v$.value.$invalid) {
      
      const payload = {
        user: route.params.id,
        reason,
        title,
        description,
        start,
        end
      }
      if (!v$.value.$invalid) {
        if (modal_store.modal?.id?.length > 0) {
          await store.saveAbsence({ _id, ...payload })
        } else {
          await store.addAbsence(payload)
        }
        await user_store.reloadCalendarFunction()
      }

      close()
    }
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>