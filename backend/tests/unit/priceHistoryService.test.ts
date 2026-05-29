import { afterEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/prisma/client";
import {
  listPriceHistoryRecords,
  createPriceHistoryRecord,
  updatePriceHistoryRecord,
  deletePriceHistoryRecord,
} from "../../src/services/priceHistoryService";

const originalPriceHistoryEntry = prisma.priceHistoryEntry;

afterEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(prisma, "priceHistoryEntry", {
    value: originalPriceHistoryEntry,
    configurable: true,
  });
});

function mockRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "ph1",
    productName: "Notebook",
    oldPrice: { toNumber: () => 3000 },
    newPrice: { toNumber: () => 2800 },
    capturedAt: new Date("2026-05-20T10:00:00.000Z"),
    ...overrides,
  };
}

describe("priceHistoryService", () => {
  describe("listPriceHistoryRecords", () => {
    it("lists records and maps Decimal types to numbers", async () => {
      Object.defineProperty(prisma, "priceHistoryEntry", {
        value: {
          findMany: vi.fn().mockResolvedValueOnce([mockRecord()]),
        },
        configurable: true,
      });

      const result = await listPriceHistoryRecords();

      expect(result).toHaveLength(1);
      expect(result[0].oldPrice).toBe(3000);
      expect(result[0].newPrice).toBe(2800);
      expect(result[0].capturedAt).toBe("2026-05-20T10:00:00.000Z");
    });

    it("returns empty array when no records", async () => {
      Object.defineProperty(prisma, "priceHistoryEntry", {
        value: {
          findMany: vi.fn().mockResolvedValueOnce([]),
        },
        configurable: true,
      });

      const result = await listPriceHistoryRecords();

      expect(result).toEqual([]);
    });
  });

  describe("createPriceHistoryRecord", () => {
    it("throws when productName is empty", async () => {
      await expect(
        createPriceHistoryRecord({ productName: "   ", oldPrice: 100, newPrice: 90 }),
      ).rejects.toThrow("Nome do produto");
    });

    it("throws when prices are NaN", async () => {
      await expect(
        createPriceHistoryRecord({ productName: "Item", oldPrice: NaN, newPrice: 90 }),
      ).rejects.toThrow("numéricos");
    });

    it("creates record with trimmed name", async () => {
      const created = mockRecord({ productName: "Notebook" });

      Object.defineProperty(prisma, "priceHistoryEntry", {
        value: {
          create: vi.fn().mockResolvedValueOnce(created),
        },
        configurable: true,
      });

      const result = await createPriceHistoryRecord({
        productName: "  Notebook  ",
        oldPrice: 3000,
        newPrice: 2800,
      });

      expect(result.productName).toBe("Notebook");
      expect(prisma.priceHistoryEntry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ productName: "Notebook" }),
        }),
      );
    });

    it("uses provided capturedAt date", async () => {
      const created = mockRecord();

      Object.defineProperty(prisma, "priceHistoryEntry", {
        value: {
          create: vi.fn().mockResolvedValueOnce(created),
        },
        configurable: true,
      });

      await createPriceHistoryRecord({
        productName: "Item",
        oldPrice: 100,
        newPrice: 90,
        capturedAt: "2026-01-15T12:00:00.000Z",
      });

      expect(prisma.priceHistoryEntry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            capturedAt: new Date("2026-01-15T12:00:00.000Z"),
          }),
        }),
      );
    });
  });

  describe("updatePriceHistoryRecord", () => {
    it("updates record successfully", async () => {
      const updated = mockRecord({ productName: "Updated" });

      Object.defineProperty(prisma, "priceHistoryEntry", {
        value: {
          update: vi.fn().mockResolvedValueOnce(updated),
        },
        configurable: true,
      });

      const result = await updatePriceHistoryRecord("ph1", { productName: "  Updated  " });

      expect(result).not.toBeNull();
      expect(result!.productName).toBe("Updated");
    });

    it("returns null on failure", async () => {
      Object.defineProperty(prisma, "priceHistoryEntry", {
        value: {
          update: vi.fn().mockRejectedValueOnce(new Error("Not found")),
        },
        configurable: true,
      });

      const result = await updatePriceHistoryRecord("nonexistent", { productName: "X" });

      expect(result).toBeNull();
    });
  });

  describe("deletePriceHistoryRecord", () => {
    it("returns true on successful delete", async () => {
      Object.defineProperty(prisma, "priceHistoryEntry", {
        value: {
          delete: vi.fn().mockResolvedValueOnce({}),
        },
        configurable: true,
      });

      const result = await deletePriceHistoryRecord("ph1");

      expect(result).toBe(true);
    });

    it("returns false on failure", async () => {
      Object.defineProperty(prisma, "priceHistoryEntry", {
        value: {
          delete: vi.fn().mockRejectedValueOnce(new Error("Not found")),
        },
        configurable: true,
      });

      const result = await deletePriceHistoryRecord("nonexistent");

      expect(result).toBe(false);
    });
  });
});
