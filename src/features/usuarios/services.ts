import type { RegisteredUser } from "./types";
import { useAuthStore } from "@features/auth/store";

const STORAGE_KEY = "registered_users";

function getRawUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRawUsers(users: RegisteredUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getAllUsers(): RegisteredUser[] {
  return getRawUsers();
}

export function updateUser(id: string, data: Partial<RegisteredUser>) {
  const users = getRawUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("Usuario no encontrado");
  users[idx] = { ...users[idx], ...data };
  saveRawUsers(users);

  const currentUser = useAuthStore.getState().user;
  if (currentUser?.id === id) {
    useAuthStore
      .getState()
      .setUser({
        ...currentUser,
        name: data.name ?? currentUser.name,
        email: data.email ?? currentUser.email,
      });
  }
}

export function deleteUser(id: string) {
  const users = getRawUsers();
  const filtered = users.filter((u) => u.id !== id);
  saveRawUsers(filtered);
}

export function updatePassword(id: string, newPassword: string) {
  const users = getRawUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("Usuario no encontrado");
  users[idx].password = newPassword;
  saveRawUsers(users);
}
