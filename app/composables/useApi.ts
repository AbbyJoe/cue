import type { AxiosInstance } from 'axios'

export function useApi() {
  const { $api } = useNuxtApp()
  return $api as AxiosInstance
}
