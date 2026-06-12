import { useMemo } from "react";

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: string;
}

interface Activity {
  id: number;
  client: string;
  action: string;
  time: string;
  status: "success" | "pending" | "error";
}

interface ChartData {
  month: string;
  value: number;
}

const stats: StatCard[] = [
  {
    title: "Total Clientes",
    value: "1,248",
    change: "+12%",
    changeType: "up",
    icon: "👥",
  },
  {
    title: "Validados",
    value: "892",
    change: "+8%",
    changeType: "up",
    icon: "✓",
  },
  {
    title: "Pendientes",
    value: "356",
    change: "-3%",
    changeType: "down",
    icon: "⏳",
  },
  { title: "Errores", value: "24", change: "+2%", changeType: "up", icon: "⚠" },
];

const chartData: ChartData[] = [
  { month: "Ene", value: 65 },
  { month: "Feb", value: 78 },
  { month: "Mar", value: 90 },
  { month: "Abr", value: 81 },
  { month: "May", value: 95 },
  { month: "Jun", value: 110 },
];

const recentActivity: Activity[] = [
  {
    id: 1,
    client: "Juan Pérez",
    action: "Validación RUC",
    time: "Hace 5 min",
    status: "success",
  },
  {
    id: 2,
    client: "María García",
    action: "Registro nuevo",
    time: "Hace 12 min",
    status: "success",
  },
  {
    id: 3,
    client: "Carlos López",
    action: "Actualización datos",
    time: "Hace 25 min",
    status: "pending",
  },
  {
    id: 4,
    client: "Ana Martínez",
    action: "Validación teléfono",
    time: "Hace 1 hora",
    status: "error",
  },
  {
    id: 5,
    client: "Pedro Sánchez",
    action: "Registro nuevo",
    time: "Hace 2 horas",
    status: "success",
  },
];

export default function Dashboard() {
  const maxValue = useMemo(
    () => Math.max(...chartData.map((d) => d.value)),
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-slate-400">
          Resumen general del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p
                  className={`text-sm mt-2 ${stat.changeType === "up" ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-300"}`}
                >
                  {stat.change} este mes
                </p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Validaciones por Mes
          </h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {chartData.map((data) => (
              <div
                key={data.month}
                className="flex flex-col items-center flex-1"
              >
                <span className="text-xs text-gray-500 dark:text-slate-400 mb-2">
                  {data.value}
                </span>
                <div
                  className="w-full bg-blue-500 rounded-t-md transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${(data.value / maxValue) * 100}%` }}
                />
                <span className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart (CSS) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Distribución de Estados
          </h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-32 h-32">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeDasharray="71.4 28.6"
                  strokeDashoffset="0"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="28.4 71.6"
                  strokeDashoffset="-71.4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="2 98"
                  strokeDashoffset="-100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  1,248
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-slate-300">
                  Validados (71%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-slate-300">
                  Pendientes (28%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-slate-300">
                  Errores (1%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Actividad Reciente
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-slate-400 border-b dark:border-slate-800">
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Acción</th>
                <th className="pb-3 font-medium">Tiempo</th>
                <th className="pb-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity) => (
                <tr
                  key={activity.id}
                  className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <td className="py-3 font-medium text-gray-800 dark:text-white">
                    {activity.client}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-slate-300">
                    {activity.action}
                  </td>
                  <td className="py-3 text-gray-500 dark:text-slate-400 text-sm">
                    {activity.time}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                          : activity.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      {activity.status === "success"
                        ? "Éxito"
                        : activity.status === "pending"
                          ? "Pendiente"
                          : "Error"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
