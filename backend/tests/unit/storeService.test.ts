import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "../../src/prisma/client";
import { createStore, deleteStore, listStores, updateStore } from "../../src/services/storeService";

const originalStore = prisma.store;

function storeRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "store-1",
    name: "Mercado Livre",
    website: "https://www.mercadolivre.com.br",
    contactEmail: "contato@mercadolivre.com.br",
    isActive: true,
    createdAt: new Date("2026-05-20T10:00:00.000Z"),
    updatedAt: new Date("2026-05-20T10:00:00.000Z"),
    ...overrides
  };
}

afterEach(() => {
  Object.defineProperty(prisma, "store", {
    value: originalStore,
    configurable: true
  });
});

describe("storeService", () => {
  it("lista lojas mapeando o retorno do Prisma", async () => {
    Object.defineProperty(prisma, "store", {
      value: {
        findMany: async () => [storeRecord()]
      },
      configurable: true
    });

    const stores = await listStores();

    expect(stores).toHaveLength(1);
    expect(stores[0].website).toBe("https://www.mercadolivre.com.br");
  });

  it("valida nome e website obrigatorios ao criar loja", async () => {
    await expect(
      createStore({ name: "", website: "https://loja.test", contactEmail: "contato@loja.test" })
    ).rejects.toThrow(/Nome da loja/);

    await expect(
      createStore({ name: "Loja", website: "   ", contactEmail: "contato@loja.test" })
    ).rejects.toThrow(/Website da loja/);
  });

  it("cria loja com campos normalizados", async () => {
    let receivedData: unknown;

    Object.defineProperty(prisma, "store", {
      value: {
        create: async ({ data }: { data: unknown }) => {
          receivedData = data;
          return storeRecord({ name: "Amazon" });
        }
      },
      configurable: true
    });

    const store = await createStore({
      name: "  Amazon  ",
      website: "  https://amazon.com.br  ",
      contactEmail: "  contato@amazon.com.br  "
    });

    expect(receivedData).toEqual({
      name: "Amazon",
      website: "https://amazon.com.br",
      contactEmail: "contato@amazon.com.br",
      isActive: true
    });
    expect(store.name).toBe("Amazon");
  });

  it("atualiza loja existente", async () => {
    Object.defineProperty(prisma, "store", {
      value: {
        update: async () => storeRecord({ isActive: false })
      },
      configurable: true
    });

    const store = await updateStore("store-1", { isActive: false });

    expect(store?.isActive).toBe(false);
  });

  it("retorna false quando a loja removida nao existe", async () => {
    Object.defineProperty(prisma, "store", {
      value: {
        delete: async () => {
          throw new Error("not found");
        }
      },
      configurable: true
    });

    await expect(deleteStore("missing")).resolves.toBe(false);
  });
});
