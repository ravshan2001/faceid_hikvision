<template>
  <miniModal>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
            <multipleSelect
              :error="v$.user.$invalid && v$.user.$dirty"
              :guide="`Выберите сотрудника`"
              v-model="data.user"
              :label="`Сотрудник`"
              placeholder="Выберите сотрудника"
              :options="users"
              option_title="fullName"
              name="user"
              :required="true"
            />
            
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
  </miniModal>
</template>
<script setup>
import { PlusIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import miniModal from '@/assets/helpers/overlays/miniModal.vue'
import multipleSelect from '@/assets/helpers/others/multipleSelect.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

defineProps({
  users: {
    type: Array,
    required: true,
  },
})

import { modalStore } from '@/stores/helpers/modal'
const modal_store = modalStore()
const { modal } = storeToRefs(modal_store)

import { doorStore } from '@/stores/data/door'
const store = doorStore()

import { notifStore } from '@/stores/helpers/notification'
const notif = notifStore()


import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

const data = ref({
  user: '',
})

import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

const rules = computed(() => ({
  user: { required },
}))
const v$ = useVuelidate(rules, data)

const reset = () => {
  data.value = {
    user: '',
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

    const { user, _id } = data.value
    if (!v$.value.$invalid) {
      const payload = {
        user,
        door: route.params.id,
      }
      await store.addSyncedWorkerDoor(payload)
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

</script>
