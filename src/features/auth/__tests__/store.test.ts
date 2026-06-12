import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../store";

describe("AuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
  });

  it("inicia sin usuario", () => {
    const { user } = useAuthStore.getState();
    expect(user).toBeNull();
  });

  it("guarda el usuario correctamente", () => {
    const mockUser = {
      id: "1",
      name: "Juan",
      email: "juan@test.com",
      token: "abc123",
    };

    useAuthStore.getState().setUser(mockUser);

    const { user } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(user?.name).toBe("Juan");
  });

  it("cierra sesión correctamente", () => {
    const mockUser = {
      id: "1",
      name: "Juan",
      email: "juan@test.com",
      token: "abc123",
    };

    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).not.toBeNull();

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
