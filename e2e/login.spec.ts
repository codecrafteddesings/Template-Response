import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test("muestra el formulario de login", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByPlaceholder("Correo")).toBeVisible();
    await expect(page.getByPlaceholder("Contraseña")).toBeVisible();
    await expect(page.getByRole("button", { name: /entrar/i })).toBeVisible();
  });

  test("redirige al dashboard después del login", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("Correo").fill("test@test.com");
    await page.getByPlaceholder("Contraseña").fill("password123");
    await page.getByRole("button", { name: /entrar/i }).click();

    // Espera a que aparezca el dashboard
    await expect(page.getByText("Validar Datos")).toBeVisible({
      timeout: 10000,
    });
  });
});
