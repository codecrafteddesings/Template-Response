import { useEffect, useState, useMemo } from "react";
import { getDashboardData } from "../services";
import type { DashboardData } from "../types";
import Card from "@ui/Card";
import Badge from "@ui/Badge";
import EmptyState from "@ui/EmptyState";

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-deepnavy/30 border-t-deepnavy rounded-full animate-spin" />
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  changeType,
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
}) {
  return (
    <Card className="hover:bg-surface-hover transition-colors">
      <div>
        <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-text-secondary">
          {title}
        </p>
        <p className="text-3xl font-display font-bold text-text-primary mt-1.5 tracking-tight">
          {value}
        </p>
        {change && (
          <p
            className={`text-xs mt-2 font-medium ${
              changeType === "up"
                ? "text-terminalgreen-dark dark:text-terminalgreen"
                : "text-redprimary"
            }`}
          >
            {change}
          </p>
        )}
      </div>
    </Card>
  );
}

const statusLabel: Record<string, "success" | "pending" | "error"> = {
  success: "success",
  pending: "pending",
  error: "error",
};

const statusText: Record<string, string> = {
  success: "Éxito",
  pending: "Pendiente",
  error: "Error",
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getDashboardData()
      .then((res) => { if (mounted) setData(res); })
      .catch(() => { if (mounted) setError("Error al cargar datos"); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const maxValue = useMemo(
    () => data ? Math.max(...data.chartData.map(d => d.value), 1) : 1,
    [data]
  );

  const total = data?.stats.total || 0;
  const validados = data?.stats.validados || 0;
  const pendientes = data?.stats.pendientes || 0;
  const vPct = total > 0 ? Math.round((validados / total) * 100) : 0;
  const pPct = total > 0 ? Math.round((pendientes / total) * 100) : 0;
  const ePct = total > 0 ? 100 - vPct - pPct : 0;

  const stats = [
    { title: "Total Clientes", value: String(total), change: "", changeType: "up" as const },
    { title: "Validados", value: String(validados), change: `${vPct}% del total`, changeType: "up" as const },
    { title: "Pendientes", value: String(pendientes), change: `${pPct}% del total`, changeType: "down" as const },
    { title: "Errores", value: String(data?.stats.errores || 0), change: `${ePct}% del total`, changeType: "down" as const },
  ];

  const formatDate = (d: string) => {
    if (d.length === 8) return `${d.slice(6,8)}/${d.slice(4,6)}/${d.slice(0,4)}`;
    return d;
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-redprimary text-sm font-medium mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-deepnavy text-white text-sm font-medium rounded-sm hover:bg-deepnavy-hover transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Resumen general del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-sm font-display font-semibold text-text-primary mb-4">
            Validaciones por Mes
          </h3>
          {data.chartData.length === 0 ? (
            <EmptyState message="Sin datos de validaciones" />
          ) : (
            <div className="flex items-end justify-between h-48 gap-2">
              {data.chartData.map((d) => (
                <div key={d.month} className="flex flex-col items-center flex-1">
                  <span className="text-[11px] font-mono text-text-secondary mb-2">{d.value}</span>
                  <div
                    className="w-full bg-deepnavy rounded-sm transition-all duration-500 hover:bg-deepnavy-hover"
                    style={{ height: `${(d.value / maxValue) * 100}%` }}
                  />
                  <span className="text-[11px] font-mono text-text-secondary mt-2">{d.month}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-display font-semibold text-text-primary mb-4">
            Distribución de Estados
          </h3>
          {total === 0 ? (
            <EmptyState message="Sin datos de distribución" />
          ) : (
            <div className="flex items-center justify-center gap-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#E8E6E1" strokeWidth="3" />
                  {vPct > 0 && (
                    <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#00DC82" strokeWidth="3"
                      strokeDasharray={`${vPct} ${100 - vPct}`} strokeDashoffset="0" />
                  )}
                  {pPct > 0 && (
                    <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#1A3A5C" strokeWidth="3"
                      strokeDasharray={`${pPct} ${100 - pPct}`} strokeDashoffset={`-${vPct}`} />
                  )}
                  {ePct > 0 && (
                    <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#DC3E3E" strokeWidth="3"
                      strokeDasharray={`${ePct} ${100 - ePct}`} strokeDashoffset={`-${vPct + pPct}`} />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-text-primary">{total}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-terminalgreen" />
                  <span className="text-sm text-text-secondary">Validados ({vPct}%)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-deepnavy" />
                  <span className="text-sm text-text-secondary">Pendientes ({pPct}%)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-redprimary" />
                  <span className="text-sm text-text-secondary">Errores ({ePct}%)</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-display font-semibold text-text-primary mb-4">
          Actividad Reciente
        </h3>
        {data.recentActivity.length === 0 ? (
          <EmptyState message="Sin actividad reciente" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-text-secondary text-[11px] font-mono font-semibold uppercase tracking-widest border-b border-border-light">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Acción</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map((activity) => (
                  <tr key={activity.id} className="border-b last:border-0 border-border-light hover:bg-surface-hover transition-colors">
                    <td className="py-3 text-sm font-medium text-text-primary">{activity.client}</td>
                    <td className="py-3 text-sm text-text-secondary">{activity.action}</td>
                    <td className="py-3 text-xs font-mono text-text-secondary">{formatDate(activity.time)}</td>
                    <td className="py-3">
                      <Badge status={statusLabel[activity.status] ?? "error"} label={statusText[activity.status] ?? "Error"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
