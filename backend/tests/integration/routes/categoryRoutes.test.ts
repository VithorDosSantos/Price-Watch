import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { app } from "../../../src/app";
import { prisma } from "../../../src/prisma/client";

const originalCategory = prisma.category;

afterEach(() => {
  Object.defineProperty(prisma, "category", {
    value: originalCategory,
    configurable: true
  });
});

describe("category routes", () => {
  it("GET /categories lista categorias pela rota publica", async () => {
    Object.defineProperty(prisma, "category", {
      value: {
        findMany: async () => [
          {
            id: "category-1",
            name: "Eletronicos",
            description: "Produtos monitorados",
            isActive: true,
            createdAt: new Date("2026-05-20T10:00:00.000Z"),
            updatedAt: new Date("2026-05-20T10:00:00.000Z")
          }
        ]
      },
      configurable: true
    });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe("Eletronicos");
  });
});
