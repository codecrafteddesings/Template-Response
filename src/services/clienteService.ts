import type { AxiosResponse } from 'axios'
import api from './api'

export const validarClient = async (datos: unknown) => {
  const response: AxiosResponse<unknown> = await api.post('ClientFormt/validar', datos)
  return response
}
