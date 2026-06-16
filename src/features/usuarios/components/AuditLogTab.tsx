import { useAuditStore } from "../store";
import Badge from "@ui/Badge";

export default function AuditLogTab() {
  const entries = useAuditStore((s) => s.entries);
  const clearEntries = useAuditStore((s) => s.clearEntries);

  if (entries.length === 0) {
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
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-text-secondary text-sm">
          No hay validaciones registradas aún.
        </p>
        <p className="text-text-secondary/50 text-xs mt-1">
          Las validaciones se registrarán automáticamente al usar el Validador
          de Tarjetas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {entries.length} validación{entries.length !== 1 ? "es" : ""}{" "}
          registrada{entries.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={clearEntries}
          className="text-xs text-text-secondary hover:text-redprimary transition-colors font-medium"
        >
          Limpiar historial
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light">
              <th className="text-left py-3 px-3 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                Usuario
              </th>
              <th className="text-left py-3 px-3 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                Cliente
              </th>
              <th className="text-left py-3 px-3 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                RUC
              </th>
              <th className="text-left py-3 px-3 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                Resultado
              </th>
              <th className="text-right py-3 px-3 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-border-light/50 hover:bg-surface-hover/50 transition-colors"
              >
                <td className="py-3 px-3 text-text-primary font-medium">
                  {entry.userName}
                </td>
                <td className="py-3 px-3 text-text-primary">
                  {entry.clientName}
                </td>
                <td className="py-3 px-3 text-text-secondary font-mono text-xs">
                  {entry.clientRuc}
                </td>
                <td className="py-3 px-3">
                  <Badge
                    status={entry.result === "exito" ? "success" : "error"}
                    label={
                      entry.result === "exito"
                        ? "Éxito"
                        : `Error ${entry.codigo}`
                    }
                  />
                </td>
                <td className="py-3 px-3 text-text-secondary text-xs text-right whitespace-nowrap">
                  {new Date(entry.fecha).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
