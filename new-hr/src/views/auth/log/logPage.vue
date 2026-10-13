<template>
  <main
    :class="`${currentTheme} h-screen flex items-center justify-center p-5 relative bg-loginbg`"
  >
    <div class="w-full max-w-[400px] space-y-6">
      <h1 class="text-center text-mainText font-extrabold text-2xl">HR</h1>

      <div class="p-5 rounded-lg flex flex-col gap-5 shadow-xl bg-formbg">
        <h1 class="text-mainText text-2xl font-bold leading-normal tracking-normal text-center">
          {{ loginMessage[locale] }}
        </h1>

        <div class="flex flex-col gap-4">
          <phoneInput
            :error="v$.phone.$invalid && v$.phone.$dirty"
            :guide="`${$t('phoneNumber')} ${$t('empty')}`"
            :label="$t('phoneNumber')"
            :required="true"
            :maska="true"
            v-model="user.phone"
            placeholder="(##) ###-##-##"
            name="phone"
          />

          <defaultInput
            :error="v$.password.$invalid && v$.password.$dirty"
            :guide="`${$t('password')} ${$t('empty')}`"
            :label="$t('password')"
            placeholder="G4hgdsu#@"
            v-model="user.password"
            name="password"
            :required="true"
            :password="true"
            @send="send"
          />
        </div>

        <button type="button" class="btn mt-3" @click="send()">
          {{ $t('login') }}
        </button>
      </div>

      <!-- <div class="text-center text-sm text-mainText">
        <span> {{ supportMessage[locale] }}: </span>
        <a :href="`tel:+998 99 868-80-78`" class="font-medium text-base text-changeText">
          +998 (99) 868-80-78
        </a>
      </div> -->
    </div>

    <!-- <themePage /> -->
  </main>
</template>
<script setup>
import themePage from './themePage.vue'
import defaultInput from '@/assets/helpers/others/defaultInput.vue'
import phoneInput from '@/assets/helpers/others/phoneInput.vue'

import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { themeStore } from '@/stores/theme/theme'
const mode = themeStore()
const { currentTheme } = storeToRefs(mode)

import { authStore } from '@/stores/admin/auth'
const store = authStore()

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()

const user = ref({
  phone: '+998 ',
  password: '',
})

import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

const rules = {
  phone: { required, minLength: minLength(7) },
  password: { required },
}
const v$ = useVuelidate(rules, user)

const send = async () => {
  try {
    v$.value.$touch()
    if (!v$.value.$invalid) {
      const codes = [90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50, 77]

      if (user.value.phone?.length == 19) {
        const dataCode = user.value.phone.slice(6, 8)

        if (codes?.some((item) => item == dataCode)) {
          if (user.value?.password?.length >= 5) {
            const formattedUser = {
              ...user.value,
              phone: user.value.phone.slice(1),
            }
            await store.login(formattedUser)
          } else {
            notif.setNotif(true, passwordLength, 'danger')
            return
          }
        } else {
          notif.setNotif(true, codesMessages, 'danger')
          return
        }
      } else {
        notif.setNotif(true, phoneNumberIncompleteMessage, 'danger')
        return
      }
    }
  } catch (err) {
    console.warn('Error', err)
  }
}

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const phoneNumberIncompleteMessage = {
  en: 'The phone number is not fully entered!',
  ru: 'Номер телефона введён не полностью!',
  uz: 'Telefon raqami to‘liq kiritilmagan!',
  kr: 'Телефон рақами тўлиқ киритилмаган!',
}

const passwordLength = {
  en: 'The password must contain at least 5 characters.',
  ru: 'Пароль должен содержать минимум 5 символов.',
  uz: 'Parol kamida 5 ta belgi bo‘lishi kerak.',
  kr: 'Парол камида 5 та белги бўлиши керак.',
}

const codesMessages = {
  en: 'Only phone numbers starting with 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50, or 77 are allowed.',
  ru: 'Номер телефона должен начинаться с 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50 или 77.',
  uz: 'Telefon raqami faqat 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50 yoki 77 bilan boshlanishi kerak.',
  kr: 'Телефон рақами фақат 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 50 ёки 77 билан бошланиши керак.',
}

const loginMessage = {
  en: 'Login to the system',
  ru: 'Вход в систему',
  uz: 'Tizimga kirish',
  kr: 'Тизимга кириш',
}

const supportMessage = {
  en: 'Support',
  ru: 'Поддержка',
  uz: 'Qo‘llab-quvvatlash',
  kr: 'Қўллаб-қувватлаш',
}
</script>
