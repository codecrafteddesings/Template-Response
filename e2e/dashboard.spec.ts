import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("muestra el formulario de validación", async ({ page }) => {
    // Navegar al dashboard (asumiendo que ya estamos autenticados o hay mock)
    await page.goto("/");

    await expect(page.getByText("Validar Datos")).toBeVisible();
    await expect(page.getByPlaceholder("Nombre")).toBeVisible();
    await expect(page.getByPlaceholder("Cédula/RUC")).toBeVisible();
    await expect(page.getByPlaceholder("Teléfono")).toBeVisible();
  });

  test("valida longitud de rucCli", async ({ page }) => {
    await page.goto("/");

    const rucInput = page.getByPlaceholder("Cédula/RUC");
    await rucInput.fill("123456789012"); // 12 dígitos

    await expect(
      page.getByText("Valor supera límite (máx 11 dígitos)"),
    ).toBeVisible();
    await expect(rucInput).toHaveClass(/border-red-500/);
  });

  test("valida longitud de telCli", async ({ page }) => {
    await page.goto("/");

    const telInput = page.getByPlaceholder("Teléfono");
    await telInput.fill("12345678901"); // 11 dígitos

    await expect(
      page.getByText("Valor supera límite (máx 10 dígitos)"),
    ).toBeVisible();
    await expect(telInput).toHaveClass(/border-red-500/);
  });

  test("limpia el formulario", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("Nombre").fill("Juan");
    await page.getByPlaceholder("Cédula/RUC").fill("123456789012");

    await page.getByRole("button", { name: /limpiar/i }).click();

    await expect(page.getByPlaceholder("Nombre")).toHaveValue("");
    await expect(page.getByPlaceholder("Cédula/RUC")).toHaveValue("");
  });
});
