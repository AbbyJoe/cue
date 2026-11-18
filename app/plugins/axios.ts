import axios from 'axios'

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: '/api/v1',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return {
    provide: {
      api,
    },
  }
})
