import api from "../../services/api";
import type { ClientFormt, RespuestaValidacion, DashboardData } from "./types";

export const validarClient = async (datos: ClientFormt): Promise<string> => {
  const { data } = await api.post<RespuestaValidacion>(
    "/api/clientes/validar",
    datos,
  );
  return data.codigoRespuesta;
};

export const getDashboardData = async (): Promise<DashboardData> => {
  const { data } = await api.get<DashboardData>("/api/dashboard");
  return data;
};
