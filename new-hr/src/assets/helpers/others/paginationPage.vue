<!-- <template>
  <div class="relative mt-auto" v-if="count > limit">
    <Paginate
      :page-count="Math.ceil(count / limit)"
      :container-class="'paginate'"
      :click-handler="changePage"
      :prev-text="prevIcon"
      :next-text="nextIcon"
      v-model="model"
    />
  </div>
</template>

<script setup>
import Paginate from 'vuejs-paginate-next'
const model = defineModel()

defineProps({
  count: {
    type: Number,
    requeired: true,
  },
  limit: {
    type: Number,
    requeired: true,
  },
})

const emit = defineEmits(['changePage'])

const changePage = (value) => {
  emit('changePage', value)
}

const prevIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>`

const nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>`
</script> -->

<template>
  <div
    :class="[
      'relative flex items-center gap-4 mt-auto pt-2',
      count > limit ? 'justify-between' : 'justify-end',
    ]"
    v-if="count > 30"
  >
    <div class="flex-1" v-if="count > limit">
      <Paginate
        :page-count="Math.ceil(count / limit)"
        :container-class="'paginate'"
        :click-handler="changePage"
        :prev-text="prevIcon"
        :next-text="nextIcon"
        v-model="model"
      />
    </div>

    <div v-if="count > 30">
      <select
        name="limit"
        id="limit"
        v-model="selectModel"
        @change="updateLimit"
        :class="[
          'w-full px-2 py-1.5 pr-10 rounded-md bg-transparent outline-none',
          'text-mainText text-base font-medium',
          'ring-1 focus:ring-offset-[1.5px]',
          'placeholder:text-placeholder',
          'ring-border focus:ring-offset-hoverAside',
        ]"
      >
        <option
          v-for="item of limits"
          :key="item._id"
          :value="item._id"
          :class="['bg-main text-changeText']"
          :hidden="item._id == selectModel"
          :disabled="item._id == selectModel"
        >
          <span v-if="item._id == selectModel">{{ limitMessage[locale] }}</span> {{ item._id }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import Paginate from 'vuejs-paginate-next'
const model = defineModel()

const props = defineProps({
  count: {
    type: Number,
    requeired: true,
  },
  limit: {
    type: Number,
    requeired: true,
  },

  select: Number,
})

const limits = [
  {
    _id: 100,
  },
  {
    _id: 50,
  },
  {
    _id: 30,
  },
]

import { ref, watch } from 'vue'
const selectModel = ref(props.select)

watch(
  () => props.select,
  (newVal) => {
    selectModel.value = newVal
  },
)
const limitMessage = {
  en: 'Limit:',
  ru: 'Лимит:',
  uz: 'Chegara:',
  kr: 'Чегара:',
}

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const emit = defineEmits(['changePage', 'updateLimit'])

const changePage = (value) => {
  emit('changePage', value)
}

const updateLimit = () => {
  emit('updateLimit', selectModel.value)
}

const prevIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>`

const nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>`
</script>
