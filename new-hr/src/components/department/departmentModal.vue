<template>
  <middleModal>
    <div class="flex flex-col gap-4">
      <defaultInput
        :error="v$.name.$invalid && v$.name.$dirty"
        v-model="data.name"
        placeholder="Введите название"
        :guide="`${$t('name')} ${$t('empty')}`"
        label="Введите название"
        :required="true"
        name="name"
        :focus="true"
      />
      <!-- <defaultSelect
        :error="v$.type.$invalid && v$.type.$dirty"
        :guide="`${$t('type')} ${$t('empty')}`"
        v-model="data.type"
        :placeholder="$t('type')"
        :required="true"
        :option="type"
        title="name"
        :label="$t('type')"
        name="type"
      /> -->
      <!-- <div v-if="data.type == 2" v-motion-slide-visible-once-bottom>
        <defaultSelect
          :error="v$.parent.$invalid && v$.parent.$dirty"
          :guide="`${$t('parent')} ${$t('empty')}`"
          :placeholder="$t('departmentText')"
          :translates="true"
          :disabled="data.type == 0"
          :label="$t('parent')"
          v-model="data.parent"
          :required="true"
          :option="parent"
          title="name"
          name="parent"
        />
      </div> -->

      <filterSelect
        :placeholder="$t('departmentText')"
        :translates="true"
        :disabled="data.type == 0"
        :label="$t('chief')"
        v-model="data.chief"
        :required="true"
        :options="users"
        option_title="fullName"
        name="chief"
      />

      <div
        class="grid grid-cols-[0.8fr_1fr_1fr] gap-4 sm:grid-cols-1"
        v-for="(item, index) of data.workTime"
        :key="index"
        v-motion-slide-visible-once-bottom
      >
        <defaultSelect
          v-model="item.day"
          :placeholder="$t('day')"
          :required="true"
          :option="weeks"
          title="name"
          :label="$t('day')"
          name="day"
          :selectedItems="data.workTime"
        />
        <timePicker
          v-model="item.startTime"
          :label="$t('start')"
          :name="`startTime${index}`"
          placeholder="08:00"
          :required="true"
        />

        <div class="flex items-center gap-2">
          <div class="flex-1">
            <timePicker
              v-model="item.endTime"
              :label="$t('end')"
              :name="`endTime${index}`"
              placeholder="16:00"
              :required="true"
              @send="send"
            />
          </div>

          <XMarkIcon
            v-if="data.workTime.length > 1"
            class="w-9 h-9 p-1 text-whiteText flex items-center justify-center mt-6 bg-red-500 rounded-md cursor-pointer hover:bg-red-500/80"
            @click="clearItem(index)"
          />

          <button
            v-if="data.workTime.length < 7 && index === data.workTime.length - 1"
            class="w-9 h-9 flex items-center justify-center mt-6 rounded-md text-whiteText cursor-pointer bg-btn hover:bg-btnHover disabled:cursor-not-allowed"
            @click="updateItems(index)"
            :disabled="!item.endTime"
          >
            <PlusIcon class="w-6 h-6" />
          </button>
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
  </middleModal>
</template>
<script setup>
defineProps({
  parent: {
    type: Array,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
})
import middleModal from '@/assets/helpers/overlays/middleModal.vue'
import defaultInput from '@/assets/helpers/others/defaultInput.vue'
import defaultSelect from '@/assets/helpers/others/defaultSelect.vue'
import filterSelect from '@/assets/helpers/others/filterSelect.vue'
import timePicker from '@/assets/helpers/others/timePicker.vue'
import { type, weeks } from '@/helpers/object'

import { PlusIcon, XMarkIcon } from '@heroicons/vue/20/solid'

const clearItem = (index) => {
  if (data.value?.workTime?.length > 1) {
    data.value.workTime.splice(index, 1)
    data.value.workTime = [...data.value.workTime]
  }
}

const updateItems = () => {
  if (data.value?.workTime?.length < 7) {
    const selectedDays = data.value.workTime.map((item) => item.day)
    const unselectedDay = weeks.find((week) => !selectedDays.includes(week._id))
    if (unselectedDay) {
      data.value.workTime = [
        ...data.value.workTime,
        { day: unselectedDay._id, startTime: '09:00', endTime: '17:00' },
      ]
    }
  }
}

import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { departmentStore } from '@/stores/data/department'
const department = departmentStore()

import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()

import { formatToISO, formatToTime } from '@/helpers/func'

const data = ref({
  name: '',
  workTime: weeks.map((week) => ({
    day: week._id,
    startTime: '09:00',
    endTime: '17:00',
  })),
  chief: '',
  file: '',
})

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = computed(() => ({
  name: { required },
}))
const v$ = useVuelidate(rules, data)

const reset = () => {
  data.value = {
    name: '',
    workTime: weeks.map((week) => ({
      day: week._id,
      startTime: '09:00',
      endTime: '17:00',
    })),
    chief: '',
  }
  v$.value.$reset()
}

const errorTime = {
  uz: 'Tugash vaqti boshlanish vaqtidan katta bo‘lishi kerak!',
  ru: 'Время окончания должно быть больше времени начала!',
  en: 'The end time must be greater than the start time!',
  kr: 'Туғаш вақти бошланиш вақтидан катта бўлиши керак!',
}

const requiredFieldsMessage = {
  en: 'All required fields are not filled!',
  ru: 'Не все обязательные поля заполнены!',
  uz: 'Barcha majburiy maydonlar to‘ldirilmagan!',
  kr: 'Барча мажбурий майдонлар тўлдирилмаган!',
}

const send = async () => {
  try {
    v$.value.$touch()
    const { name, type, parent, chief, workTime, _id } = data.value

    if (!v$.value.$invalid) {
      const hasValidEntry = workTime.some(
        (item) => item.day?.length > 0 || item.startTime?.length > 0 || item.endTime?.length > 0,
      )

      if (!hasValidEntry) {
        notif.setNotif(true, requiredFieldsMessage, 'warning')
        return
      }

      

      const formattedWorkTime = workTime.map((item) => ({
        ...item,
        startTime: formatToISO(item.startTime),
        endTime: formatToISO(item.endTime),
      }))

      const payload = {
        name,
        type,
        workTime: formattedWorkTime,
        parent,
        chief,
      }

      if (modal_store.modal.id?.length > 0) {
        await department.saveDepartment({ _id, ...payload })
      } else {
        await department.addDepartment(payload)
      }
      close()
    }
  } catch (err) {
    console.warn('Error', err)
  }
}

const close = () => {
  reset()
  modal_store.close()
}

watch(modal, (newVal) => {
  if (!newVal?.show) {
    reset()
  }
})

watch(modal, async (newVal) => {
  if (newVal?.id?.length > 0) {
    const res = await department.getDepartment(newVal?.id)
    // console.log(res.data)

    const formattedTime = Array.isArray(res.data?.workTime)
    ? res.data.workTime.map((item) => ({
        ...item,
        startTime: formatToTime(item.startTime),
        endTime: formatToTime(item.endTime),
      }))
    : []

    data.value = {
      ...res.data,
      workTime: formattedTime,
    }
  }
})
</script>
