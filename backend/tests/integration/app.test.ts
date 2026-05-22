import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/authService", () => ({
  registerUser: vi.fn(async () => ({
    token: "integration-token",
    user: {
      id: "user-1",
      email: "test@example.com",
      name: "Teste Integração",
      role: "USER"
    }
  })),
  loginUser: vi.fn()
}));

import { app } from "../../src/app";

describe("app integration", () => {
  it("GET /health returns app status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "online",
      service: "PriceWatch API"
    });
    expect(typeof response.body.timestamp).toBe("string");
  });

  it("POST /auth/register returns the created user payload", async () => {
    const registerResponse = await request(app).post("/auth/register").send({
      name: "Teste Integração",
      email: "test@example.com",
      password: "password123"
    });

    expect(registerResponse.status).toBe(200);
    expect(registerResponse.body.user).toMatchObject({
      email: "test@example.com",
      name: "Teste Integração"
    });
    expect(registerResponse.body.token).toBe("integration-token");
  });
});
