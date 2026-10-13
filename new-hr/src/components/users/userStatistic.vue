<template>
  <defaultMain>
    <div>
      UserStatistika
    </div>
  </defaultMain>
  <!-- </defaultMain> -->
</template>
<script setup>

import defaultMain from '@/views/home/defaultMain.vue'

import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
import { ChevronLeftIcon } from '@heroicons/vue/20/solid'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()





</script>