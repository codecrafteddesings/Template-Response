import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ValidarClientes from "../ValidarClientes";

vi.mock("../../../dashboard/services", () => ({
  validarClient: vi.fn().mockResolvedValue("00"),
}));

describe("ValidarClientes", () => {
  it("renderiza el formulario correctamente", () => {
    render(<ValidarClientes />);

    expect(screen.getByText("Validar Clientes")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingrese nombre")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("Ingrese apellido").length).toBe(2);
    expect(screen.getByPlaceholderText("12345678901")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0991234567")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /validar cliente/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /limpiar/i }),
    ).toBeInTheDocument();
  });

  it("los botones tienen tamaño consistente y responsivo", () => {
    render(<ValidarClientes />);

    const submitBtn = screen.getByRole("button", { name: /validar cliente/i });
    const clearBtn = screen.getByRole("button", { name: /limpiar/i });

    expect(submitBtn.className).toContain("px-6");
    expect(clearBtn.className).toContain("px-6");
    expect(submitBtn.className).toContain("sm:flex-none");
    expect(clearBtn.className).toContain("sm:flex-none");
  });

  it("muestra error cuando rucCli no tiene 11 dígitos", async () => {
    const user = userEvent.setup();
    render(<ValidarClientes />);

    const rucInput = screen.getByPlaceholderText("12345678901");
    await user.type(rucInput, "12345");

    expect(screen.getByText(/11/)).toBeInTheDocument();
    expect(rucInput).toHaveClass("border-red-500");
  });

  it("muestra error cuando telCli no tiene 10 dígitos", async () => {
    const user = userEvent.setup();
    render(<ValidarClientes />);

    const telInput = screen.getByPlaceholderText("0991234567");
    await user.type(telInput, "12345");

    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(telInput).toHaveClass("border-red-500");
  });

  it("limpia todos los campos al hacer clic en Limpiar", async () => {
    const user = userEvent.setup();
    render(<ValidarClientes />);

    await user.type(screen.getByPlaceholderText("Ingrese nombre"), "Juan");
    await user.type(screen.getByPlaceholderText("12345678901"), "12345678901");

    fireEvent.click(screen.getByRole("button", { name: /limpiar/i }));

    expect(screen.getByPlaceholderText("Ingrese nombre")).toHaveValue("");
    expect(screen.getByPlaceholderText("12345678901")).toHaveValue("");
  });
});
