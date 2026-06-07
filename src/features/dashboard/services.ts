import api from '../../services/api'
import type { ClientFormt, RespuestaValidacion } from './types'

export const validarClient = async (datos: ClientFormt): Promise<string> => {
  // Aqui apunta a la ruta del backend que llama al stored procedures
  const { data } = await api.post<RespuestaValidacion>('/clientes/validar', datos)
  return data.codigoRespuesta
}
