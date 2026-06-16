import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuditEntry } from "./types";

interface AuditState {
  entries: AuditEntry[];
  addEntry: (entry: Omit<AuditEntry, "id" | "fecha">) => void;
  clearEntries: () => void;
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
              fecha: new Date().toISOString(),
            },
            ...state.entries,
          ],
        })),
      clearEntries: () => set({ entries: [] }),
    }),
    { name: "audit-log" },
  ),
);
