import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerificacionView from "../VerificacionView";

vi.mock("../../../dashboard/services", () => ({
  validarClient: vi.fn().mockResolvedValue("00"),
}));

describe("VerificacionView", () => {
  it("renderiza el formulario correctamente", () => {
    render(<VerificacionView />);

    expect(screen.getByText("Validador de Tarjetas")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingrese nombre")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("Ingrese apellido").length).toBe(2);
    expect(screen.getByPlaceholderText("402-4567890-1")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("829-772-9654")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /verificar datos/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /limpiar/i }),
    ).toBeInTheDocument();
  });

  it("los botones tienen tamaño consistente y responsivo", () => {
    render(<VerificacionView />);

    const submitBtn = screen.getByRole("button", { name: /verificar datos/i });
    const clearBtn = screen.getByRole("button", { name: /limpiar/i });

    expect(submitBtn.className).toContain("px-6");
    expect(clearBtn.className).toContain("px-6");
    expect(submitBtn.className).toContain("sm:flex-none");
    expect(clearBtn.className).toContain("sm:flex-none");
  });

  it("muestra error cuando rucCli no tiene 11 dígitos", async () => {
    const user = userEvent.setup();
    render(<VerificacionView />);

    const rucInput = screen.getByPlaceholderText("402-4567890-1");
    await user.type(rucInput, "12345");

    expect(screen.getByText(/11/)).toBeInTheDocument();
    expect(rucInput).toHaveClass("border-red-500");
  });

  it("muestra error cuando telCli no tiene 10 dígitos", async () => {
    const user = userEvent.setup();
    render(<VerificacionView />);

    const telInput = screen.getByPlaceholderText("829-772-9654");
    await user.type(telInput, "12345");

    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(telInput).toHaveClass("border-red-500");
  });

  it("limpia todos los campos al hacer clic en Limpiar", async () => {
    const user = userEvent.setup();
    render(<VerificacionView />);

    await user.type(screen.getByPlaceholderText("Ingrese nombre"), "Juan");
    await user.type(
      screen.getByPlaceholderText("402-4567890-1"),
      "12345678901",
    );

    fireEvent.click(screen.getByRole("button", { name: /limpiar/i }));

    expect(screen.getByPlaceholderText("Ingrese nombre")).toHaveValue("");
    expect(screen.getByPlaceholderText("402-4567890-1")).toHaveValue("");
  });
});
