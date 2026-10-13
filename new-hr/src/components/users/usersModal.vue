<template>
  <defaultModal>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
            <multipleSelect
              :error="v$.department.$invalid && v$.department.$dirty"
              :guide="`${$t('department')} ${$t('empty')}`"
              v-model="data.department"
              :label="$t('department')"
              placeholder="department"
              :options="department"
              option_title="name"
              name="department"
              :required="true"
            />
            <defaultSelect
              :error="v$.role.$invalid && v$.role.$dirty"
              :guide="`${$t('role')} ${$t('empty')}`"
              v-model="data.role"
              :label="$t('role')"
              placeholder="worker"
              :option="role"
              name="role"
              :required="true"
              title="name"
            />
          </div>

          <!-- <severalArray
            v-if="data.role == 'security'"
            :required="true"
            label="Doors"
            :options="door"
            option_title="title"
            name="door"
            v-model="data.doors"
            :error="v$.doors.$invalid && v$.doors.$dirty"
            :guide="`Doors ${$t('empty')}`"
          /> -->

          <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
            <defaultInput
              :error="v$.fullName.$invalid && v$.fullName.$dirty"
              v-model="data.fullName"
              placeholder="John Wick"
              :guide="`${$t('fullName')} ${$t('empty')}`"
              :label="$t('fullName')"
              :required="true"
              name="fullName"
            />

            <phoneInput
              :error="v$.phone.$invalid && v$.phone.$dirty"
              placeholder="(##) ###-##-##"
              :guide="`${$t('phoneNumber')} ${$t('empty')}`"
              :label="$t('phoneNumber')"
              v-model="data.phone"
              :required="true"
              name="phone"
            />
          </div>

          <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
            <genderPage
              :error="v$.gender.$invalid && v$.gender.$dirty"
              :guide="`${$t('gender')} ${$t('empty')}`"
              :option="gender"
              option_title="translates"
              v-model="data.gender"
              :required="true"
              :label="$t('gender')"
              name="gender"
            />
            <defaultInput
              :error="v$.password.$invalid && v$.password.$dirty"
              :guide="`${$t('password')} ${$t('empty')}`"
              v-model="data.password"
              placeholder="Gz9!tQvX#2pLm$7d"
              :label="modal.id?.length > 0 ? $t('newPassword') : $t('password')"
              :required="modal.id?.length ? false : true"
              :password="true"
              name="password"
            />
          </div>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
            <birthDate
              v-model="data.birthDay"
              :error="v$.birthDay.$invalid && v$.birthDay.$dirty"
              :label="$t('birthDate')"
              placeholder="dd-mm-yyyy"
              :required="true"
              :guide="`${$t('birthDate')} ${$t('empty')}`"
              name="birthDay"
            />
            <defaultInput
              :error="v$.address.$invalid && v$.address.$dirty"
              :guide="`${$t('address')} ${$t('empty')}`"
              :placeholder="$t('address')"
              :label="$t('address')"
              v-model="data.address"
              :required="true"
              name="address"
            />
          </div>

          <uploadFile
            class="col-span-2"
            :label="$t('faceUrl')"
            name="upload"
            folder="user"
            v-model="data.faceUrl"
            :error="v$.faceUrl.$invalid && v$.faceUrl.$invalid && v$.faceUrl.$dirty"
            :guide="`${$t('faceUrl')} ${$t('empty')}`"
            :required="true"
          />
        </div>

        <div class="space-y-4" v-if="door.length > 0">
          <div
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <label
              v-for="item in door"
              :key="item?._id"
              class="flex items-center space-x-2 p-2 border rounded cursor-pointer text-mainText"
            >
              <input
                type="checkbox"
                :value="item?._id"
                :checked="Array.isArray(data.doors) && data.doors.includes(item?._id)"
                @change="toggleDoor(item?._id)"
              />
              <span>{{ item?.title }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 ml-auto mt-4">
        <button type="button" @click="close()" class="cancelBtn">
          {{ $t('cancel') }}
        </button>

        <button type="button" @click="send" class="btn">
          {{ $t('add') }}
        </button>
      </div>
    </div>
  </defaultModal>
</template>
<script setup>
import { PlusIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import defaultModal from '@/assets/helpers/overlays/defaultModal.vue'
import defaultInput from '@/assets/helpers/others/defaultInput.vue'
import defaultSelect from '@/assets/helpers/others/defaultSelect.vue'
import timePicker from '@/assets/helpers/others/timePicker.vue'
import uploadFile from '@/assets/helpers/others/uploadFile.vue'
import severalArray from '@/assets/helpers/others/severalArray.vue'
import genderPage from '@/assets/helpers/others/genderPage.vue'
import phoneInput from '@/assets/helpers/others/phoneInput.vue'
import { weeks, role, gender } from '@/helpers/object'
import birthDate from '@/assets/helpers/others/birthDate.vue'
import multipleSelect from '@/assets/helpers/others/multipleSelect.vue'
import { formatToISODate, fromDateToClassic } from '@/helpers/func'


defineProps({
  department: {
    type: Array,
    required: true,
  },
  door: {
    type: Array,
    required: true,
  },
})

import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)

import { userStore } from '@/stores/data/users'
const store = userStore()

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()


import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

const data = ref({
  fullName: '',
  phone: '+998 ',
  password: '',
  role: '',
  faceUrl: '',
  department: '',
  gender: '',
  birthDay: '',
  address: '',
  doors: [],
})

const toggleDoor = (id) => {
  const index = data.value.doors.indexOf(id)
  if (index === -1) {
    data.value.doors.push(id)
  } else {
    data.value.doors.splice(index, 1)
  }
}

import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

const rules = computed(() => ({
  fullName: { required },
  phone: { required, minLength: minLength(6) },
  password: modal.value?.id?.length > 0 ? {} : { required },
  role: { required },
  faceUrl: { required },
  department: { required },
  gender: { required },
  birthDay: { required },
  address: { required },
  gender: { required },
}))
const v$ = useVuelidate(rules, data)

const reset = () => {
  data.value = {
    fullName: '',
    phone: '+998 ',
    password: '',
    role: '',
    faceUrl: '',
    department: '',
    gender: '',
    birthDay: '',
    address: '',
    doors: [],
  }
  v$.value.$reset()
}

const close = () => {
  reset()
  modal_store.close()
}


const send = async () => {
  try {
    v$.value.$touch()

    const { fullName, phone, password, role, faceUrl, department, gender, birthDay, address, doors, _id } =
      data.value
    if (!v$.value.$invalid) {
      const codes = [90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50, 77]
      const dataCode = phone.slice(6, 8)

      if (phone?.length !== 19) {
        return notif.setNotif(true, phoneNumberIncompleteMessage, 'danger')
      }

      if (!codes.includes(Number(dataCode))) {
        return notif.setNotif(true, codesMessages, 'danger')
      }

      if (!modal.value?.id?.length > 0) {
        if (!password || password.length < 5) {
          return notif.setNotif(true, passwordLength, 'danger')
        }
      }
      const formatDate = formatToISODate(birthDay)

      const payload = {
        fullName,
        phone: phone.slice(1),
        password: password || '',
        role,
        faceUrl,
        department,
        gender,
        birthDay: formatDate,
        address,
        // workTime: formattedWorkTime,
        doors,
      }

      if (modal_store.modal.id?.length > 0) {
        await store.saveUser({ _id, ...payload })
      } else {
        await store.addUser(payload)
      }
      close()
    }
  } catch (err) {
    console.warn('Error', err)
  }
}

watch(modal, (newVal) => {
  if (!newVal?.show) {
    reset()
  }
})

watch(modal, async (newVal) => {
  if (newVal?.id?.length > 0) {
    const res = await store.getUser(newVal?.id)
    console.log('Put', res.data)
    if (!res?.data) throw new Error('No data received')
    // const formattedTime = res.data.workTime.map((item) => ({
    //   ...item,
    //   startTime: formatToTime(item.startTime),
    //   endTime: formatToTime(item.endTime),
    // }))

    const formattedPhone = `+${res.data?.phone}`
    data.value = {
      ...res.data,
      phone: formattedPhone,
      birthDay: res.data?.birthDay ? fromDateToClassic(res.data?.birthDay) : null,
      doors: Array.isArray(res.data.doors) ? res.data.doors : []
      // workTime: formattedTime,
    }
  }
})


const phoneNumberIncompleteMessage = {
  en: 'The phone number is not fully entered!',
  ru: 'Номер телефона введён не полностью!',
  uz: 'Telefon raqami to‘liq kiritilmagan!',
  kr: 'Телефон рақами тўлиқ киритилмаган!',
}

const codesMessages = {
  en: 'Only phone numbers starting with 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50, or 77 are allowed.',
  ru: 'Номер телефона должен начинаться с 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50 или 77.',
  uz: 'Telefon raqami faqat 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50 yoki 77 bilan boshlanishi kerak.',
  kr: 'Телефон рақами фақат 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50 ёки 77 билан бошланиши керак.',
}

const passwordLength = {
  en: 'The password must contain at least 5 characters.',
  ru: 'Пароль должен содержать минимум 5 символов.',
  uz: 'Parol kamida 5 ta belgi bo‘lishi kerak.',
  kr: 'Парол камида 5 та белги бўлиши керак.',
}
</script>
