import { expect, test } from "@playwright/test";

test("registro, login, update de perfil e exclusao", async ({ page }) => {
  const timestamp = Date.now();
  const email = `e2e_${timestamp}@pricewatch.local`;
  const password = "Senha#123";
  const newPassword = "Senha#1234";

  await page.goto("/register");

  await page.getByPlaceholder("Seu nome").fill("Usuario E2E");
  await page.getByPlaceholder("email@exemplo.com").fill(email);
  await page.getByPlaceholder("Crie uma senha").fill(password);
  await page.getByPlaceholder("Repita a senha").fill(password);
  await page.getByRole("button", { name: "Criar conta" }).click();

  await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();

  await page.goto("/profile");
  await page.getByPlaceholder("Seu nome").fill("Usuario E2E Atualizado");
  await page.getByPlaceholder("Deixe em branco para manter").fill(newPassword);
  await page.getByPlaceholder("Repita a nova senha").fill(newPassword);
  await page.getByRole("button", { name: "Salvar perfil" }).click();
  await expect(page.getByText("Perfil atualizado")).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();

  await page.goto("/login");
  await page.getByPlaceholder("email@exemplo.com").fill(email);
  await page.getByPlaceholder("Sua senha").fill(newPassword);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("Login realizado")).toBeVisible();

  await page.goto("/profile");
  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });
  await page.getByRole("button", { name: "Excluir conta" }).click();
  await expect(page).toHaveURL(/\/register/);
  await expect(page.getByRole("heading", { name: "Criar conta" })).toBeVisible();
});

test("rota protegida redireciona para login", async ({ page }) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "Entrar na conta" })).toBeVisible();
});
