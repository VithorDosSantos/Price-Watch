import { afterEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/prisma/client";

vi.mock("../../src/services/productService", () => ({
  getProductById: vi.fn(),
  upsertProduct: vi.fn(),
}));

import { getProductById, upsertProduct } from "../../src/services/productService";
import {
  createFavorite,
  listFavorites,
  deleteFavorite,
} from "../../src/services/favoriteService";

const mockedGetProductById = vi.mocked(getProductById);
const mockedUpsertProduct = vi.mocked(upsertProduct);

const originalFavorite = prisma.favorite;

afterEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(prisma, "favorite", {
    value: originalFavorite,
    configurable: true,
  });
});

describe("favoriteService", () => {
  describe("createFavorite", () => {
    it("throws when product is not found", async () => {
      mockedGetProductById.mockResolvedValueOnce(null);

      await expect(
        createFavorite({ productId: "p1", userId: "u1" }),
      ).rejects.toThrow("Produto não encontrado");
    });

    it("creates favorite with default userName", async () => {
      mockedGetProductById.mockResolvedValueOnce({
        id: "p1",
        externalId: "e1",
        name: "Product",
        price: 100,
      } as any);
      mockedUpsertProduct.mockResolvedValueOnce("saved-p1");

      const mockFav = {
        id: "f1",
        productId: "saved-p1",
        userId: "u1",
        userName: "Aluno PriceWatch",
        product: { id: "saved-p1", name: "Product" },
      };

      Object.defineProperty(prisma, "favorite", {
        value: {
          create: vi.fn().mockResolvedValueOnce(mockFav),
        },
        configurable: true,
      });

      const result = await createFavorite({ productId: "p1", userId: "u1" });

      expect(result.userName).toBe("Aluno PriceWatch");
      expect(mockedUpsertProduct).toHaveBeenCalled();
    });

    it("creates favorite with custom userName", async () => {
      mockedGetProductById.mockResolvedValueOnce({
        id: "p1",
        externalId: "e1",
        name: "Product",
        price: 100,
      } as any);
      mockedUpsertProduct.mockResolvedValueOnce("saved-p1");

      const mockFav = {
        id: "f1",
        productId: "saved-p1",
        userId: "u1",
        userName: "Custom User",
        product: { id: "saved-p1", name: "Product" },
      };

      Object.defineProperty(prisma, "favorite", {
        value: {
          create: vi.fn().mockResolvedValueOnce(mockFav),
        },
        configurable: true,
      });

      const result = await createFavorite({
        productId: "p1",
        userId: "u1",
        userName: "Custom User",
      });

      expect(result.userName).toBe("Custom User");
    });
  });

  describe("listFavorites", () => {
    it("returns favorites filtered by userId", async () => {
      const favorites = [
        { id: "f1", userId: "u1", product: { name: "P1" } },
        { id: "f2", userId: "u1", product: { name: "P2" } },
      ];

      Object.defineProperty(prisma, "favorite", {
        value: {
          findMany: vi.fn().mockResolvedValueOnce(favorites),
        },
        configurable: true,
      });

      const result = await listFavorites("u1");

      expect(result).toHaveLength(2);
      expect(prisma.favorite.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "u1" },
          orderBy: { createdAt: "desc" },
        }),
      );
    });
  });

  describe("deleteFavorite", () => {
    it("returns null when favorite not found or not owned", async () => {
      Object.defineProperty(prisma, "favorite", {
        value: {
          findFirst: vi.fn().mockResolvedValueOnce(null),
        },
        configurable: true,
      });

      const result = await deleteFavorite("f1", "u1");

      expect(result).toBeNull();
    });

    it("deletes the favorite when ownership is valid", async () => {
      const existingFav = { id: "f1", userId: "u1", product: { name: "P1" } };

      Object.defineProperty(prisma, "favorite", {
        value: {
          findFirst: vi.fn().mockResolvedValueOnce(existingFav),
          delete: vi.fn().mockResolvedValueOnce(existingFav),
        },
        configurable: true,
      });

      const result = await deleteFavorite("f1", "u1");

      expect(result).toEqual(existingFav);
      expect(prisma.favorite.delete).toHaveBeenCalledWith({ where: { id: "f1" } });
    });
  });
});
