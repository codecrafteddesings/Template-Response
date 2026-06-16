import { useState } from "react";
import { useAuthStore } from "@features/auth/store";
import { updateUser, updatePassword } from "../services";
import Card from "@ui/Card";

export default function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (password && password !== confirmPassword) {
        setMessage({ tipo: "error", texto: "Las contraseñas no coinciden" });
        setSaving(false);
        return;
      }

      if (!user) return;

      updateUser(user.id, { name, email });
      setUser({ ...user, name, email });

      if (password) {
        updatePassword(user.id, password);
        setPassword("");
        setConfirmPassword("");
      }

      setMessage({ tipo: "exito", texto: "Perfil actualizado correctamente" });
    } catch {
      setMessage({ tipo: "error", texto: "Error al actualizar perfil" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <Card>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Nombre completo
            </label>
            <input
              type="text"
              className="w-full border border-border-light rounded-sm px-3 py-2.5 bg-surface text-text-primary placeholder:text-text-secondary/50 text-sm outline-none transition-all duration-150 focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full border border-border-light rounded-sm px-3 py-2.5 bg-surface text-text-primary placeholder:text-text-secondary/50 text-sm outline-none transition-all duration-150 focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <hr className="border-border-light" />

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Nueva contraseña{" "}
              <span className="text-text-secondary/50">(opcional)</span>
            </label>
            <input
              type="password"
              className="w-full border border-border-light rounded-sm px-3 py-2.5 bg-surface text-text-primary placeholder:text-text-secondary/50 text-sm outline-none transition-all duration-150 focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Dejar en blanco para mantener"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              className="w-full border border-border-light rounded-sm px-3 py-2.5 bg-surface text-text-primary placeholder:text-text-secondary/50 text-sm outline-none transition-all duration-150 focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetir contraseña"
            />
          </div>

          {message && (
            <p
              className={`text-xs font-medium flex items-center gap-2 ${
                message.tipo === "exito"
                  ? "text-terminalgreen-dark dark:text-terminalgreen"
                  : "text-redprimary"
              }`}
            >
              {message.tipo === "exito" ? (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path d="M10.28 2.22a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 011.06-1.06L4.25 7.19l4.97-4.97a.75.75 0 011.06 0z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path d="M6 1.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V2.25A.75.75 0 016 1.5zM6 8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  <path
                    fillRule="evenodd"
                    d="M6 0a6 6 0 100 12A6 6 0 006 0zM1.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {message.texto}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-deepnavy hover:bg-deepnavy-hover text-white px-5 py-2.5 rounded-sm font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving && (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-text-secondary hover:text-redprimary text-sm font-medium transition-colors px-3"
            >
              Cerrar sesión
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
