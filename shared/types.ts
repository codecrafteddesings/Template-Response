// ─── Cliente ──────────────────────────────────────────────────────
export interface ClienteForm {
  nomCli: string;
  patCli: string;
  matCli: string;
  corrCli: string;
  rucCli: string;
  telCli: string;
  codVal: string;
}

export interface RespuestaValidacion {
  codigoRespuesta: string;
}

// ─── Auth ─────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

// ─── API Error ────────────────────────────────────────────────────
export interface ApiError {
  error: string;
  detalles?: Record<string, string[]>;
}
