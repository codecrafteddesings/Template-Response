import api from "../../services/api";
import type { ClientFormt, RespuestaValidacion } from "./types";

export const validarClient = async (datos: ClientFormt): Promise<string> => {
  await new Promise((r) => setTimeout(r, 1500));
  const { data } = await api.post<RespuestaValidacion>(
    "/api/clientes/validar",
    datos,
  );
  return data.codigoRespuesta;
};
