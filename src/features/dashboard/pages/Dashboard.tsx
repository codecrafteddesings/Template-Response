import { useEffect, useState, useMemo } from "react";
import { getDashboardData } from "../services";
import type { DashboardData } from "../types";

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
    { title: "Total Clientes", value: String(total), change: "", changeType: "up" as const, icon: "👥" },
    { title: "Validados", value: String(validados), change: `${vPct}% del total`, changeType: "up" as const, icon: "✓" },
    { title: "Pendientes", value: String(pendientes), change: `${pPct}% del total`, changeType: "down" as const, icon: "⏳" },
    { title: "Errores", value: String(data?.stats.errores || 0), change: `${ePct}% del total`, changeType: "down" as const, icon: "⚠" },
  ];

  const formatDate = (d: string) => {
    if (d.length === 8) return `${d.slice(6,8)}/${d.slice(4,6)}/${d.slice(0,4)}`;
    return d;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-slate-400">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                {stat.change && (
                  <p className={`text-sm mt-2 ${stat.changeType === "up" ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-300"}`}>
                    {stat.change}
                  </p>
                )}
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Validaciones por Mes</h3>
          {data.chartData.length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400 text-center py-8">Sin datos</p>
          ) : (
            <div className="flex items-end justify-between h-48 gap-2">
              {data.chartData.map((d) => (
                <div key={d.month} className="flex flex-col items-center flex-1">
                  <span className="text-xs text-gray-500 dark:text-slate-400 mb-2">{d.value}</span>
                  <div className="w-full bg-blue-500 rounded-t-md transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${(d.value / maxValue) * 100}%` }} />
                  <span className="text-xs text-gray-500 dark:text-slate-400 mt-2">{d.month}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Distribución de Estados</h3>
          {total === 0 ? (
            <p className="text-gray-500 dark:text-slate-400 text-center py-8">Sin datos</p>
          ) : (
            <div className="flex items-center justify-center gap-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
                  {vPct > 0 && (
                    <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#22c55e" strokeWidth="3"
                      strokeDasharray={`${vPct} ${100 - vPct}`} strokeDashoffset="0" />
                  )}
                  {pPct > 0 && (
                    <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#3b82f6" strokeWidth="3"
                      strokeDasharray={`${pPct} ${100 - pPct}`} strokeDashoffset={`-${vPct}`} />
                  )}
                  {ePct > 0 && (
                    <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#ef4444" strokeWidth="3"
                      strokeDasharray={`${ePct} ${100 - ePct}`} strokeDashoffset={`-${vPct + pPct}`} />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">{total}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-600 dark:text-slate-300">Validados ({vPct}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm text-gray-600 dark:text-slate-300">Pendientes ({pPct}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm text-gray-600 dark:text-slate-300">Errores ({ePct}%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Actividad Reciente</h3>
        {data.recentActivity.length === 0 ? (
          <p className="text-gray-500 dark:text-slate-400 text-center py-8">Sin actividad reciente</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 dark:text-slate-400 border-b dark:border-slate-800">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Acción</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map((activity) => (
                  <tr key={activity.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="py-3 font-medium text-gray-800 dark:text-white">{activity.client}</td>
                    <td className="py-3 text-gray-600 dark:text-slate-300">{activity.action}</td>
                    <td className="py-3 text-gray-500 dark:text-slate-400 text-sm">{formatDate(activity.time)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                          : activity.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      }`}>
                        {activity.status === "success" ? "Éxito" : activity.status === "pending" ? "Pendiente" : "Error"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
