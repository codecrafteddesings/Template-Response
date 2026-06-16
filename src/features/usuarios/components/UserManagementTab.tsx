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
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        {users.length} usuario{users.length !== 1 ? "s" : ""} registrado
        {users.length !== 1 ? "s" : ""}
      </p>

      {message && (
        <p
          className={`text-xs font-medium ${message.tipo === "exito" ? "text-terminalgreen-dark dark:text-terminalgreen" : "text-redprimary"}`}
        >
          {message.texto}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light">
              <th className="text-left py-3 px-3 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                ID
              </th>
              <th className="text-left py-3 px-3 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                Nombre
              </th>
              <th className="text-left py-3 px-3 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                Correo
              </th>
              <th className="text-right py-3 px-3 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-border-light/50 hover:bg-surface-hover/50 transition-colors"
              >
                <td className="py-3 px-3 text-text-secondary font-mono text-xs">
                  #{u.id}
                </td>
                <td className="py-3 px-3">
                  {editingId === u.id ? (
                    <input
                      type="text"
                      className="w-full border border-border-light rounded-sm px-2.5 py-1.5 bg-surface text-text-primary text-sm outline-none focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    <span className="text-text-primary font-medium">
                      {u.name}
                    </span>
                  )}
                </td>
                <td className="py-3 px-3">
                  {editingId === u.id ? (
                    <input
                      type="email"
                      className="w-full border border-border-light rounded-sm px-2.5 py-1.5 bg-surface text-text-primary text-sm outline-none focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    <span className="text-text-secondary">{u.email}</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right">
                  {editingId === u.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSave(u.id)}
                        className="text-terminalgreen-dark dark:text-terminalgreen hover:underline text-xs font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-text-secondary hover:text-text-primary text-xs transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(u)}
                        className="text-deepnavy dark:text-blue-300 hover:underline text-xs font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-redprimary hover:underline text-xs font-medium"
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
