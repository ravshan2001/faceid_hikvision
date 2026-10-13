<template>
  <div class="h-full hidden sm:flex items-center justify-end">
    <div class="flex items-center gap-2">
      <button
        class="p-2 rounded-md bg-editBtn flex items-center justify-center hover:bg-editBtnHover"
        @click="modal.setModal(true, name, id)"
      >
        <PencilSquareIcon class="w-5 h-5 text-whiteText" />
      </button>

      <button
        type="button"
        class="p-2 rounded-md bg-red-500 flex items-center justify-center hover:bg-red-400"
        @click="remove.setRemove(true, name, id)"
      >
        <TrashIcon class="w-5 h-5 text-whiteText" />
      </button>
    </div>
  </div>
</template>
<script setup>
import { TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
})

import { modalStore } from '@/stores/helpers/modal'
const modal = modalStore()

import { removeStore } from '@/stores/helpers/remove'
const remove = removeStore()
</script>
