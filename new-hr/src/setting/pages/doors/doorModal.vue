<template>
  <miniModal>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
        <defaultSelect
          :error="v$.branch.$invalid && v$.branch.$dirty"
          :guide="`${$t('type')} ${$t('empty')}`"
          v-model="data.branch"
          placeholder="Филиал"
          :required="true"
          :option="branch_store.activeBranch"
          title="title"
          label="Филиал"
          name="branch"
        />
        <defaultSelect
          :error="v$.type.$invalid && v$.type.$dirty"
          :guide="`${$t('type')} ${$t('empty')}`"
          v-model="data.type"
          :placeholder="$t('type')"
          :required="true"
          :option="typeDoor"
          title="name"
          :label="`${$t('type')}`"
          name="type"
          :focus="true"
        />

        <defaultInput
          :error="v$.title.$invalid && v$.title.$dirty"
          v-model="data.title"
          :placeholder="$t('title')"
          :guide="`${$t('title')} ${$t('empty')}`"
          :label="$t('title')"
          :required="true"
          name="title"
        />

        <defaultInput
          :error="v$.ip.$invalid && v$.ip.$dirty"
          v-model="data.ip"
          placeholder="192.168.1.1"
          :guide="`Ip ${$t('empty')} (Format: IPv4:PORT)`"
          label="IP:Port"
          :required="true"
          name="ip"
          @send="send"
        />

        <defaultInput
          :error="v$.port.$invalid && v$.port.$dirty"
          v-model="data.port"
          placeholder="8080"
          :guide="`Port ${$t('empty')} (Format: 8080`"
          label="Port"
          :required="true"
          name="port"
          @send="send"
        />

        <defaultInput
          :error="v$.login.$invalid && v$.login.$dirty"
          v-model="data.login"
          :placeholder="$t('login')"
          :guide="`${$t('login')} ${$t('empty')}`"
          :label="$t('login')"
          :required="true"
          name="login"
        />
        
        <defaultInput
          :error="v$.password.$invalid && v$.password.$dirty"
          :password="true"
          v-model="data.password"
          :placeholder="$t('password')"
          :guide="`${$t('password')} ${$t('empty')}`"
          :label="$t('password')"
          :required="true"
          name="password"
          @send="send"
        />

        <defaultCheckbox
          v-model="data.isOpen"
          label="Общедоступный"
          name="isOpen"
          @send="send"
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
import defaultCheckbox from '@/assets/helpers/others/defaultcheckbox.vue'
import { typeDoor } from '@/helpers/object'

import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { doorStore } from '@/stores/data/door'
const store = doorStore()

import { branchStore } from '@/stores/data/branch'
const branch_store = branchStore()

import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()

const data = ref({
  branch: '',
  title: '',
  ip: '',
  type: '',
  login: '',
  password: '',
  port: '',
  isOpen: false,
})

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  branch: { required },
  title: { required },
  ip: { required },
  type: { required },
  login: { required },
  password: { required },
  port: { required },
}
const v$ = useVuelidate(rules, data)

const reset = () => {
  data.value = {
    branch: '',
    title: '',
    ip: '',
    type: '',
    login: '',
    password: '',
    port: '',
    isOpen: false,
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
    const res = await store.getDoor(newVal?.id)
    // console.log(res.data)

    data.value = {
      ...res.data,
    }
  }
})

const filialMessage = {
  en: 'Branch',
  ru: 'Филиал',
  uz: 'Filial',
  kr: 'Филиал',
}

// bUY YERDA CHOTKIY DASTURCHI KODLARI
const ipFormatMessage = {
  en: 'The IP address must be in IPv4:PORT format (e.g. 192.168.1.1).',
  ru: 'IP-адрес должен соответствовать формату IPv4:PORT (например, 192.168.1.1:8080).',
  uz: "IP manzili IPv4:PORT formatida bo'lishi kerak (masalan, 192.168.1.1:8080).",
  kr: 'IP манзили IPv4:PORT форматида бўлиши керак (масалан, 192.168.1.1:8080).',
}

import { validateIPv4WithPort } from '@/helpers/func'
const send = async () => {
  try {
    v$.value.$touch()
    const { branch, title, ip, type, login, password, port, isOpen, _id } = data.value

    if (!v$.value.$invalid) {
      if (!validateIPv4WithPort(ip)) {
        notif.setNotif(true, ipFormatMessage, 'warning')
        return
      }
      // console.log("ikkinchi tekshiriuv");
      
      const payload = {
        branch,
        title,
        ip,
        type,
        login,
        password,
        port,
        isOpen,
      }
      // console.log('Payload', payload)
      if (!v$.value.$invalid) {
        if (modal_store.modal?.id?.length > 0) {
          await store.saveDoor({ _id, ...payload })
        } else {
          await store.addDoor(payload)
        }
      }
      close()
    }
  } catch (err) {
    console.warn('Error', err)
  }
}
</script>
