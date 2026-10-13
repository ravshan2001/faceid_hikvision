<template>
  <div v-if="store.statusDoors.length > 0" class="px-[25px] py-[18px] rounded-[13px] shadow-sm bg-hover space-y-4">
    <div class="text-mainText text-[18px] font-bold">
        Статус всех дверей
      </div>
    <div class="flex gap-8">
      <!-- Chap ustun -->
      <div class="flex-1 space-y-2">
        <div
          class="flex justify-between items-center w-full border-b pb-1"
          v-for="door in leftDoors"
          :key="door._id"
        >
          <div>
            <div class="font-bold text-sm text-mainText">{{ door?.branch?.title }}</div>
            <div class="text-xs text-mainText">{{ door?.title }}</div>
          </div>
          <!-- <div 
            :class="door?.type === 'exit' ? 'text-redColor' : door?.type === 'enter' ? 'text-greenColor' : ''"
          >
            {{ getDoorTypeName(door?.type, $i18n.locale) || '' }}
          </div> -->
          <div 
            class="px-2 py-1 rounded-[13px] text-whiteText text-xs"
            :class="door.status == 'online' ? 'bg-greenColor' : 'bg-redColor'"
          >
            {{ door.status == 'online' ? 'Актив' : 'Неактив' }}
          </div>
        </div>
      </div>
      <!-- O‘ng ustun -->
      <div class="flex-1 space-y-2">
        <div
          class="flex justify-between items-center w-full border-b pb-1"
          v-for="door in rightDoors"
          :key="door._id"
        >
          <div>
            <div class="font-bold text-sm text-mainText">{{ door?.branch?.title }}</div>
            <div class="text-xs text-mainText">{{ door?.title }}</div>
          </div>
          <!-- <div 
            :class="door?.type === 'exit' ? 'text-redColor' : door?.type === 'enter' ? 'text-greenColor' : ''"
          >
            {{ getDoorTypeName(door?.type, $i18n.locale) || '' }}
          </div> -->
          <div 
            class="px-2 py-1 rounded-[13px] text-whiteText text-xs"
            :class="door.status == 'online' ? 'bg-greenColor' : 'bg-redColor'"
          >
            {{ door.status == 'online' ? 'Актив' : 'Неактив' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { typeDoor } from '@/helpers/object'
import { doorStore } from '@/stores/data/door'
const store = doorStore()

const leftDoors = computed(() =>
  store.statusDoors.slice(0, Math.ceil(store.statusDoors.length / 2))
)
const rightDoors = computed(() =>
  store.statusDoors.slice(Math.ceil(store.statusDoors.length / 2))
)


// Eshikni turini olamiz
const getDoorTypeName = (typeId, locale) => {
  const doorType = typeDoor.find((type) => type._id === typeId);
  return doorType ? doorType.name[locale] : '';
};

</script>