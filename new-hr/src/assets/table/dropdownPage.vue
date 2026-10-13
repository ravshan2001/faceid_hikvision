<template>
  <div class="h-full flex items-center justify-end sm:hidden">
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton
          class="flex items-center justify-center gap-x-1.5 rounded-md bg-modal p-2 text-sm font-semibold text-mainText shadow-sm ring-1 ring-inset ring-border hover:bg-hover"
        >
          <EllipsisVerticalIcon class="h-5 w-5 text-changeText" aria-hidden="true" />
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems
          :class="[
            'absolute z-10 w-56 divide-y divide-border rounded-md bg-modal shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            boolen ? 'origin-top-right mb-2 right-0 bottom-full' : 'origin-top-right mt-2 right-0',
          ]"
        >
          <div class="py-1" v-if="edit!=='noEdit'">
            <MenuItem v-slot="{ active }">
              <button
                type="button"
                :class="[
                  active ? 'bg-hover text-changeText' : 'text-mainText',
                  'group flex items-center gap-3 px-4 py-2 text-sm w-full font-medium',
                ]"
                @click="modal.setModal(true, name, id)"
              >
                <PencilSquareIcon
                  class="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {{ $t('edit') }}
              </button>
            </MenuItem>
          </div>

          <div class="py-1">
            <MenuItem v-slot="{ active }">
              <button
                type="button"
                :class="[
                  active ? 'bg-hover text-changeText' : 'text-mainText',
                  'group flex items-center gap-3 px-4 py-2 text-sm w-full font-medium',
                ]"
                @click="remove.setRemove(true, name, id)"
              >
                <TrashIcon
                  class="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {{ $t('delete') }}
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { PencilSquareIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/vue/20/solid'

defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  boolen: {
    required: true,
    type: Boolean,
  },
  edit: {
    type: String,
  },
})

import { modalStore } from '@/stores/helpers/modal'
const modal = modalStore()

import { removeStore } from '@/stores/helpers/remove'
const remove = removeStore()
</script>
