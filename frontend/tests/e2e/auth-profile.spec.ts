import { expect, test } from "@playwright/test";

async function mockAuthApi(page: import("@playwright/test").Page) {
  const state: {
    user: { id: string; email: string; name?: string; role: string } | null;
    password: string;
  } = {
    user: null,
    password: ""
  };

  await page.route("**/auth/register", async (route) => {
    const payload = route.request().postDataJSON() as {
      name?: string;
      email: string;
      password: string;
    };

    state.user = {
      id: "e2e-user-1",
      email: payload.email,
      name: payload.name,
      role: "USER"
    };
    state.password = payload.password;

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "e2e-token",
        user: state.user,
        isFirstAdmin: false
      })
    });
  });

  await page.route("**/auth/login/local", async (route) => {
    const payload = route.request().postDataJSON() as {
      email: string;
      password: string;
    };

    if (!state.user || payload.email !== state.user.email || payload.password !== state.password) {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid credentials" })
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "e2e-token",
        user: state.user
      })
    });
  });

  await page.route("**/auth/me", async (route) => {
    const method = route.request().method();

    if (method === "GET") {
      if (!state.user) {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ message: "Unauthorized" })
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user: state.user })
      });
      return;
    }

    if (method === "PATCH") {
      if (!state.user) {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ message: "Unauthorized" })
        });
        return;
      }

      const payload = route.request().postDataJSON() as { name?: string; password?: string };

      state.user = {
        ...state.user,
        name: payload.name ?? state.user.name
      };
      if (payload.password) {
        state.password = payload.password;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user: state.user })
      });
      return;
    }

    if (method === "DELETE") {
      state.user = null;
      state.password = "";
      await route.fulfill({ status: 204, body: "" });
      return;
    }

    await route.fallback();
  });
}

test("registro, login, update de perfil e exclusao", async ({ page }) => {
  await mockAuthApi(page);

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
  await page.route("**/auth/me", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "Unauthorized" })
    });
  });

  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "Entrar na conta" })).toBeVisible();
});
