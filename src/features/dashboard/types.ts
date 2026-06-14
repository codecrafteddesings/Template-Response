export type { ClienteForm as ClientFormt } from "../../../shared/types";
export type { RespuestaValidacion } from "../../../shared/types";

export interface DashboardStats {
  total: number;
  validados: number;
  pendientes: number;
  errores: number;
}

export interface ChartDataPoint {
  month: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  client: string;
  action: string;
  time: string;
  status: "success" | "pending" | "error";
}

export interface DashboardData {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  recentActivity: ActivityItem[];
}
