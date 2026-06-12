import { create } from "zustand";

interface ThemeState {
  dark: boolean;
  toggle: () => void;
}

const getInitialTheme = (): boolean => {
  if (typeof window === "undefined") return false;
  const saved = window.localStorage.getItem("themeDark");
  return saved === "true";
};

export const useThemeStore = create<ThemeState>((set) => ({
  dark: getInitialTheme(),
  toggle: () =>
    set((s) => {
      const next = !s.dark;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("themeDark", String(next));
      }
      return { dark: next };
    }),
}));
