<template>
  <miniModal>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
        <defaultInput
          :error="v$.title.$invalid && v$.title.$dirty"
          v-model="data.title"
          placeholder="Название"
          :guide="`Название ${$t('empty')}`"
          label="Название"
          :required="true"
          name="title"
        />

        <defaultInput
          v-model="data.description"
          placeholder="Описание"
          :guide="`Описание ${$t('empty')} (например: Описание филиала)`"
          label="Описание"
          name="description"
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

import { branchStore } from '@/stores/data/branch'
const store = branchStore()

import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()

const data = ref({
  title: '',
  description: '',
})

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  title: { required },
}
const v$ = useVuelidate(rules, data)

const reset = () => {
  data.value = {
    title: '',
    description: '',
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
    const res = await store.getBranch(newVal?.id)
    // console.log(res.data)

    data.value = {
      ...res.data,
    }
  }
})



const send = async () => {
  try {
    v$.value.$touch()
    const { title, description, _id } = data.value

    if (!v$.value.$invalid) {
      
      const payload = {
        title,
        description,
      }
      // console.log('Payload', payload)
      if (!v$.value.$invalid) {
        if (modal_store.modal?.id?.length > 0) {
          await store.saveBranch({ _id, ...payload })
        } else {
          await store.addBranch(payload)
        }
      }
      close()
    }
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>