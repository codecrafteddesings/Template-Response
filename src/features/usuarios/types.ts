export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  clientName: string;
  clientRuc: string;
  result: "exito" | "error";
  codigo: string;
  fecha: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}
