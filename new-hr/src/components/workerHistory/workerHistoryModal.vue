<template>
  <miniModal>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-1 h-fit" v-motion-slide-visible-once-bottom>
        <defaultInput
          :error="v$.company.$invalid && v$.company.$dirty"
          :placeholder="$t('company')"
          :label="$t('company')"
          v-model="data.company"
          name="company"
        />
        <defaultInput
          :error="v$.staffPosition.$invalid && v$.staffPosition.$dirty"
          :placeholder="$t('staffPosition')"
          :label="$t('staffPosition')"
          v-model="data.staffPosition"
          name="staffPosition"
        />
        <birthDate
          :error="v$.enterDate.$invalid && v$.enterDate.$dirty"
          v-model="data.enterDate"
          :label="$t('enterDate')"
          placeholder="dd-mm-yyyy"
          name="enterDate"
        />
        <birthDate
          v-model="data.leaveDate"
          :label="$t('leaveDate')"
          placeholder="dd-mm-yyyy"
          name="leaveDate"
        />
        <div class="col-span-2">
          <textareaPage
            name="comment"
            v-model="data.comment"
            :placeholder="$t('comment')"
            :label="$t('comment')"
          />
        </div>
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
import birthDate from '@/assets/helpers/others/birthDate.vue'
import textareaPage from '@/assets/helpers/others/textareaPage.vue'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { workerHistoryStore } from '@/stores/data/workerHistory'
const store = workerHistoryStore()
import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)
import { formatToISODate } from '@/helpers/func'
import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()
import { useRoute } from 'vue-router'
const route = useRoute()


const data = ref({
  company: '',
  staffPosition: '',
  enterDate: '',
  leaveDate: '',
  comment: '',
})

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  company: { required },
  staffPosition: { required },
  enterDate: { required },
}
const v$ = useVuelidate(rules, data)

const reset = () => {
  data.value = {
    company: '',
    staffPosition: '',
    enterDate: '',
    leaveDate: '',
    comment: '',
  }
  v$.value.$reset()
}

const close = () => {
  reset()
  modal_store.setModal(false, '', '')
}

watch(modal, async (newVal) => {
  if (!newVal.show) {
    reset()
  }
})


watch(modal, async (newVal) => {
  if (newVal?.id?.length > 0) {
    const res = await store.getWorker(newVal?.id)
    // console.log(res.data)

    data.value = {
      ...res.data,
      enterDate: res.data.enterDate ? new Date(res.data.enterDate).toISOString().split('T')[0] : '',
      leaveDate: res.data.leaveDate ? new Date(res.data.leaveDate).toISOString().split('T')[0] : ' ',
    }
  }
})


const send = async () => {
  // console.log("clickkk");
  
  try {
    v$.value.$touch()
    const { company, staffPosition, enterDate, leaveDate, comment, _id } = data.value
// console.log("clickkk2222");
    if (!v$.value.$invalid) {
      
      const payload = {
        user: route.params.id,
        company,
        staffPosition,
        enterDate: formatToISODate(enterDate),
        leaveDate: formatToISODate(leaveDate),
        comment,
      }
      if (!v$.value.$invalid) {
        // console.log("clickkk3333");
        if (modal_store.modal?.id?.length > 0) {
          await store.saveWorker({ _id, ...payload })
        } else {
          await store.addWorker(payload)
        }
      }
      close()
    }
  } catch (err) {
    console.warn('Error', err)
  }
}

</script>

// watch(modal, async (newVal) => {
//   if (newVal?.id?.length > 0) {
//     const res = await store.getWorker(newVal?.id)
//     console.log('Res', res.data)

//     const formattedBirthDay = fromDateToClassic(res.data.worker.birthDay)
//     const formattedHistoryDates = res.data.history.map((item) => ({
//       ...item,
//       enterDate: fromDateToClassic(item.enterDate),
//       leaveDate: fromDateToClassic(item.leaveDate),
//     }))

//     const emptyData = [
//       { company: '', staffPosition: '', enterDate: '', leaveDate: '', comment: '' },
//     ]

//     data.value = {
//       ...res.data.worker,
//       birthDay: formattedBirthDay,
//       history: res.data.history.length ? formattedHistoryDates : emptyData,
//     }
//   }
// })


