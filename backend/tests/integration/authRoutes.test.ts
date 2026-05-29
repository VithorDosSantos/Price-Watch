import jwt from "jsonwebtoken";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../../src/app";
import { prisma } from "../../src/prisma/client";

const JWT_SECRET = process.env.JWT_SECRET ?? "change_this_to_a_secure_value";
const originalUser = prisma.user;

vi.mock("../../src/services/authService", () => ({
  registerUser: vi.fn(async () => ({
    token: "integration-token",
    user: {
      id: "user-1",
      email: "test@example.com",
      name: "Teste Integração",
      role: "USER",
    },
  })),
  loginUser: vi.fn(async () => ({
    token: "login-token",
    user: {
      id: "user-1",
      email: "test@example.com",
      name: "Teste Integração",
      role: "USER",
    },
  })),
  getCurrentUser: vi.fn(async () => ({
    user: {
      id: "user-1",
      email: "test@example.com",
      name: "Teste Integração",
      role: "USER",
    },
  })),
  updateCurrentUser: vi.fn(async () => ({
    user: {
      id: "user-1",
      email: "test@example.com",
      name: "Nome Atualizado",
      role: "USER",
    },
  })),
  deleteCurrentUser: vi.fn(async () => undefined),
}));

function buildToken(role = "USER") {
  return jwt.sign({ userId: "user-1", role }, JWT_SECRET);
}

afterEach(() => {
  Object.defineProperty(prisma, "user", {
    value: originalUser,
    configurable: true,
  });
});

describe("auth routes", () => {
  it("POST /auth/register retorna usuario criado", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Teste Integração",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("test@example.com");
    expect(response.body.token).toBe("integration-token");
  });

  it("POST /auth/login/local retorna token", async () => {
    const response = await request(app).post("/auth/login/local").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("login-token");
  });

  it("GET /auth/me exige token", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
  });

  it("GET /auth/me retorna usuario autenticado", async () => {
    Object.defineProperty(prisma, "user", {
      value: {
        findUnique: async () => ({
          id: "user-1",
          email: "test@example.com",
          name: "Teste Integração",
          role: "USER",
        }),
      },
      configurable: true,
    });

    const token = buildToken();
    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("test@example.com");
  });

  it("PATCH /auth/me atualiza usuario autenticado", async () => {
    Object.defineProperty(prisma, "user", {
      value: {
        update: async () => ({
          id: "user-1",
          email: "test@example.com",
          name: "Nome Atualizado",
          role: "USER",
        }),
      },
      configurable: true,
    });

    const token = buildToken();
    const response = await request(app)
      .patch("/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Nome Atualizado" });

    expect(response.status).toBe(200);
    expect(response.body.user.name).toBe("Nome Atualizado");
  });

  it("DELETE /auth/me remove usuario autenticado", async () => {
    Object.defineProperty(prisma, "user", {
      value: {
        delete: async () => ({ id: "user-1" }),
      },
      configurable: true,
    });

    const token = buildToken();
    const response = await request(app)
      .delete("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
