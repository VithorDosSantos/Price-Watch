import jwt from "jsonwebtoken";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { app } from "../../src/app";
import { prisma } from "../../src/prisma/client";

const originalAlert = prisma.priceAlert;
const originalProduct = prisma.product;
const JWT_SECRET = process.env.JWT_SECRET ?? "change_this_to_a_secure_value";

function buildToken(userId = "user-1", role = "USER") {
  return jwt.sign({ userId, role }, JWT_SECRET);
}

afterEach(() => {
  Object.defineProperty(prisma, "priceAlert", {
    value: originalAlert,
    configurable: true
  });
  Object.defineProperty(prisma, "product", {
    value: originalProduct,
    configurable: true
  });
});

describe("alert routes", () => {
  it("GET /alerts exige autenticacao", async () => {
    const response = await request(app).get("/alerts");

    expect(response.status).toBe(401);
  });

  it("GET /alerts lista alertas do usuario autenticado", async () => {
    Object.defineProperty(prisma, "priceAlert", {
      value: {
        findMany: async () => [
          {
            id: "alert-1",
            userId: "user-1",
            targetPrice: 2999,
            email: "user@example.com",
            isActive: true,
            createdAt: new Date("2026-05-21T10:00:00.000Z"),
            product: {
              id: "prod-1",
              externalId: "ext-1",
              name: "Notebook",
              price: 3999,
              imageUrl: null,
              productUrl: null,
              storeName: "Loja",
              category: null
            }
          }
        ]
      },
      configurable: true
    });

    const token = buildToken("user-1");
    const response = await request(app)
      .get("/alerts")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe("alert-1");
  });

  it("POST /alerts cria alerta para usuario autenticado", async () => {
    Object.defineProperty(prisma, "product", {
      value: {
        findFirst: async () => ({
          id: "prod-1",
          externalId: "ext-1",
          name: "Notebook",
          price: 3999,
          imageUrl: null,
          productUrl: null,
          storeName: "Loja",
          category: null
        }),
        upsert: async () => ({ id: "prod-1", externalId: "ext-1" })
      },
      configurable: true
    });

    Object.defineProperty(prisma, "priceAlert", {
      value: {
        create: async () => ({
          id: "alert-1",
          userId: "user-1",
          targetPrice: 2999,
          email: "user@example.com",
          isActive: true,
          createdAt: new Date("2026-05-21T10:00:00.000Z"),
          product: {
            id: "prod-1",
            externalId: "ext-1",
            name: "Notebook",
            price: 3999,
            imageUrl: null,
            productUrl: null,
            storeName: "Loja",
            category: null
          }
        })
      },
      configurable: true
    });

    const token = buildToken("user-1");
    const response = await request(app)
      .post("/alerts")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: "prod-1", targetPrice: 2999, email: "user@example.com" });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe("alert-1");
  });

  it("PUT /alerts/:id atualiza alerta do usuario autenticado", async () => {
    Object.defineProperty(prisma, "priceAlert", {
      value: {
        findFirst: async () => ({
          id: "alert-1",
          userId: "user-1",
          targetPrice: 2999,
          email: "user@example.com",
          isActive: true
        }),
        update: async () => ({
          id: "alert-1",
          userId: "user-1",
          targetPrice: 2500,
          email: "user@example.com",
          isActive: false,
          createdAt: new Date("2026-05-21T10:00:00.000Z"),
          product: {
            id: "prod-1",
            externalId: "ext-1",
            name: "Notebook",
            price: 3999,
            imageUrl: null,
            productUrl: null,
            storeName: "Loja",
            category: null
          }
        })
      },
      configurable: true
    });

    const token = buildToken("user-1");
    const response = await request(app)
      .put("/alerts/alert-1")
      .set("Authorization", `Bearer ${token}`)
      .send({ targetPrice: 2500, isActive: false });

    expect(response.status).toBe(200);
    expect(response.body.targetPrice).toBe(2500);
    expect(response.body.isActive).toBe(false);
  });

  it("DELETE /alerts/:id remove alerta do usuario autenticado", async () => {
    Object.defineProperty(prisma, "priceAlert", {
      value: {
        findFirst: async () => ({
          id: "alert-1",
          userId: "user-1",
          product: { id: "prod-1" }
        }),
        delete: async () => ({ id: "alert-1" })
      },
      configurable: true
    });

    const token = buildToken("user-1");
    const response = await request(app)
      .delete("/alerts/alert-1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
