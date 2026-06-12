import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "../Dashboard";

describe("Dashboard", () => {
  it("renderiza el título del dashboard", () => {
    render(<Dashboard />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("muestra las tarjetas de estadísticas", () => {
    render(<Dashboard />);
    expect(screen.getByText("Total Clientes")).toBeInTheDocument();
    expect(screen.getByText("Validados")).toBeInTheDocument();
    expect(screen.getByText("Pendientes")).toBeInTheDocument();
    expect(screen.getByText("Errores")).toBeInTheDocument();
  });

  it("muestra el gráfico de validaciones por mes", () => {
    render(<Dashboard />);
    expect(screen.getByText("Validaciones por Mes")).toBeInTheDocument();
    expect(screen.getByText("Ene")).toBeInTheDocument();
    expect(screen.getByText("Jun")).toBeInTheDocument();
  });

  it("muestra la tabla de actividad reciente", () => {
    render(<Dashboard />);
    expect(screen.getByText("Actividad Reciente")).toBeInTheDocument();
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("María García")).toBeInTheDocument();
  });
});
