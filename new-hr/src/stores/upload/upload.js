import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import cookies from 'vue-cookies'

const folder = '/upload/photo'
const url = import.meta.env.VITE_URL
const token = cookies.get('access-token')

export const uploadStore = defineStore('uploadStore', () => {
  const image = ref({
    path: '',
    size: 0,
  })

  const uploadFile = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await axios.post(`${url}${folder}/department`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      // console.log('Upload Res', data)
      image.value.path = data

      // console.log('Image', image.value)
    } catch (err) {
      console.warn('Upload', err)
    }
  }

  return {
    image,
    uploadFile,
  }
})
