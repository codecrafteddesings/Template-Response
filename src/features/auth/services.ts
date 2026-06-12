import type { User, RegisterRequest } from "./types";

const STORAGE_KEY = "registered_users";

function getStoredUsers(): Array<RegisterRequest & { id: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUser(user: RegisterRequest & { id: string }) {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export const loginRequest = async (
  email: string,
  password: string,
): Promise<User> => {
  // Simular delay de red
  await new Promise((r) => setTimeout(r, 1500));

  const users = getStoredUsers();
  const found = users.find((u) => u.email === email && u.password === password);

  if (!found) {
    throw new Error("Credenciales inválidas");
  }

  return {
    id: found.id,
    name: found.name,
    email: found.email,
    token: `token-${Date.now()}`,
  };
};

export const registerRequest = async (
  datos: RegisterRequest,
): Promise<User> => {
  // Simular delay de red
  await new Promise((r) => setTimeout(r, 1500));

  const users = getStoredUsers();
  const existe = users.find((u) => u.email === datos.email);

  if (existe) {
    throw new Error("El correo ya está registrado");
  }

  const newUser = {
    ...datos,
    id: String(users.length + 1),
  };

  saveUser(newUser);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    token: `token-${Date.now()}`,
  };
};

export const clearAllUsers = () => {
  localStorage.removeItem(STORAGE_KEY);
};
