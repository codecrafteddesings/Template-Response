import { useState } from "react";
import ProfileTab from "../components/ProfileTab";
import AuditLogTab from "../components/AuditLogTab";
import UserManagementTab from "../components/UserManagementTab";

type Tab = "perfil" | "auditoria" | "usuarios";

const tabs: { id: Tab; label: string; icon: string }[] = [
  {
    id: "perfil",
    label: "Mi Perfil",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
  {
    id: "auditoria",
    label: "Auditoría",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "usuarios",
    label: "Usuarios",
    icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  },
];

export default function UsuariosPage() {
  const [activeTab, setActiveTab] = useState<Tab>("perfil");

  return (
    <div className="space-y-8 animate-fade-in mx-auto max-w-5xl">
      <div className="pb-4 border-b border-border-light/50">
        <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight">
          Usuarios
        </h1>
        <p className="text-sm text-text-secondary mt-2">
          Gestión de perfil, auditoría y usuarios del sistema
        </p>
      </div>

      <div className="relative">
        <div className="flex gap-1 border-b border-border-light bg-surface/50 p-1 rounded-t-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px relative ${
                activeTab === tab.id
                  ? "border-deepnavy text-deepnavy dark:text-blue-300 dark:border-blue-300 bg-white dark:bg-slate-800"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-light hover:bg-surface/50"
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={tab.icon}
                />
              </svg>
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-deepnavy dark:bg-blue-300" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px] bg-white dark:bg-slate-800 border border-border-light border-t-0 rounded-b-sm p-6 shadow-sm">
          {activeTab === "perfil" && <ProfileTab />}
          {activeTab === "auditoria" && <AuditLogTab />}
          {activeTab === "usuarios" && <UserManagementTab />}
        </div>
      </div>
    </div>
  );
}
