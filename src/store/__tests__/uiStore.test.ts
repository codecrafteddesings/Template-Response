import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "../uiStore";

describe("UIStore", () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarOpen: false });
  });

  it("inicia con sidebar cerrado", () => {
    const { sidebarOpen } = useUIStore.getState();
    expect(sidebarOpen).toBe(false);
  });

  it("abre y cierra el sidebar", () => {
    const { toggleSidebar, closeSidebar } = useUIStore.getState();

    toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);

    toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);

    toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);

    closeSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });
});
