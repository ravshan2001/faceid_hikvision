import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useRoute } from 'vue-router'
import router from '@/router'
import { useI18n } from 'vue-i18n'

export const modalStore = defineStore('modalStore', () => {
  const { t, locale } = useI18n()
  const route = useRoute()
  const modal = ref({
    show: false,
    name: '',
    title: '',
    id: '',
    lang: '',
  })

  const setModal = (show, name, id, lang) => {
    // console.log('setModal', show, name, id, lang);
    
    if (route?.name === name) {
      if (id?.length > 0) {
        modal.value = {
          show,
          name,
          title:
            locale.value == 'uz' || locale.value == 'kr'
              ? `${route?.meta?.title?.[locale.value]} ${t('edit')}`
              : `${t('edit')} ${route?.meta?.title?.[locale?.value]}`,
          id,
          lang,
        }
      } else {
        modal.value = {
          show,
          name,
          title:
            locale.value == 'uz' || locale.value == 'kr'
              ? `${route?.meta?.title?.[locale.value]} ${t('add')}`
              : `${t('add')} ${route?.meta?.title?.[locale?.value]}`,
          id,
          lang,
        }
      }
    } else {
      modal.value = {
        show: false,
        name: '',
        id: '',
        lang: '',
        title: '',
        data: {},
      }
    }
  }

  const close = () => {
    modal.value = {
      show: false,
      name: '',
      title: '',
      id: '',
      lang: '',
    }
  }

  router.beforeEach((to) => {
    if (to?.name !== modal.value.name) {
      close()
    }
  })

  return {
    modal,
    setModal,
    close,
  }
})
