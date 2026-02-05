import api from "@services/api";
import type { User } from "./types";

export const loginRequest = async (
  email: string,
  password: string,
): Promise<User> => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};
