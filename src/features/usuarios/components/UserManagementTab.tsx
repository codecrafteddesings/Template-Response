import { useState, useCallback } from "react";
import type { RegisteredUser } from "../types";
import { getAllUsers, updateUser, deleteUser } from "../services";

export default function UserManagementTab() {
  const [users, setUsers] = useState<RegisteredUser[]>(getAllUsers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [message, setMessage] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);

  const startEdit = (u: RegisteredUser) => {
    setEditingId(u.id);
    setEditName(u.name);
    setEditEmail(u.email);
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const refreshUsers = useCallback(() => setUsers(getAllUsers()), []);

  const handleSave = (id: string) => {
    try {
      updateUser(id, { name: editName, email: editEmail });
      setEditingId(null);
      refreshUsers();
      setMessage({ tipo: "exito", texto: "Usuario actualizado" });
    } catch {
      setMessage({ tipo: "error", texto: "Error al actualizar" });
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteUser(id);
      refreshUsers();
      setMessage({ tipo: "exito", texto: "Usuario eliminado" });
    } catch {
      setMessage({ tipo: "error", texto: "Error al eliminar" });
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-12 h-12 mx-auto text-text-secondary/30 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
        <p className="text-text-secondary text-sm">
          No hay usuarios registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border-light">
        <p className="text-sm text-text-secondary font-medium">
          {users.length} usuario{users.length !== 1 ? "s" : ""} registrado
          {users.length !== 1 ? "s" : ""}
        </p>
        {message && (
          <p
            className={`text-xs font-medium px-3 py-1.5 rounded-sm ${
              message.tipo === "exito"
                ? "text-terminalgreen-dark dark:text-terminalgreen bg-terminalgreen-bg/50 border border-terminalgreen/20"
                : "text-redprimary bg-redprimary-bg/50 border border-redprimary/20"
            }
            `}
          >
            {message.texto}
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-sm border border-border-light">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border-light">
              <th className="text-left py-4 px-4 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                ID
              </th>
              <th className="text-left py-4 px-4 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Nombre
              </th>
              <th className="text-left py-4 px-4 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Correo
              </th>
              <th className="text-right py-4 px-4 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light/50">
            {users.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-surface-hover/50 transition-colors duration-150"
              >
                <td className="py-4 px-4 text-text-secondary font-mono text-xs">
                  #{u.id}
                </td>
                <td className="py-4 px-4">
                  {editingId === u.id ? (
                    <input
                      type="text"
                      className="w-full border border-border-light rounded-sm px-2.5 py-1.5 bg-surface text-text-primary text-sm outline-none focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20 hover:border-border-medium"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      aria-label="Editar nombre de usuario"
                    />
                  ) : (
                    <span className="text-text-primary font-medium">
                      {u.name}
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {editingId === u.id ? (
                    <input
                      type="email"
                      className="w-full border border-border-light rounded-sm px-2.5 py-1.5 bg-surface text-text-primary text-sm outline-none focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20 hover:border-border-medium"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      aria-label="Editar correo de usuario"
                    />
                  ) : (
                    <span className="text-text-secondary">{u.email}</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  {editingId === u.id ? (
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleSave(u.id)}
                        className="text-terminalgreen-dark dark:text-terminalgreen hover:text-terminalgreen-dark hover:underline text-xs font-medium transition-colors px-2 py-1 rounded-sm hover:bg-terminalgreen-bg/50"
                        aria-label="Guardar cambios"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-text-secondary hover:text-text-primary hover:underline text-xs transition-colors px-2 py-1 rounded-sm hover:bg-surface-hover"
                        aria-label="Cancelar edición"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => startEdit(u)}
                        className="text-deepnavy dark:text-blue-300 hover:text-deepnavy dark:hover:text-blue-300 hover:underline text-xs font-medium transition-colors px-2 py-1 rounded-sm hover:bg-deepnavy/5"
                        aria-label="Editar usuario"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-redprimary hover:text-redprimary/80 hover:underline text-xs font-medium transition-colors px-2 py-1 rounded-sm hover:bg-redprimary/5"
                        aria-label="Eliminar usuario"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
