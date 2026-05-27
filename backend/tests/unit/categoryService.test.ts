import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "../../src/prisma/client";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../../src/services/categoryService";

const originalCategory = prisma.category;

function categoryRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "category-1",
    name: "Eletronicos",
    description: "Produtos eletronicos monitorados",
    isActive: true,
    createdAt: new Date("2026-05-20T10:00:00.000Z"),
    updatedAt: new Date("2026-05-20T10:00:00.000Z"),
    ...overrides
  };
}

afterEach(() => {
  Object.defineProperty(prisma, "category", {
    value: originalCategory,
    configurable: true
  });
});

describe("categoryService", () => {
  it("lista categorias mapeando datas para ISO", async () => {
    Object.defineProperty(prisma, "category", {
      value: {
        findMany: async () => [categoryRecord()]
      },
      configurable: true
    });

    const categories = await listCategories();

    expect(categories).toHaveLength(1);
    expect(categories[0].name).toBe("Eletronicos");
    expect(categories[0].createdAt).toBe("2026-05-20T10:00:00.000Z");
  });

  it("cria categoria validando nome obrigatorio", async () => {
    await expect(createCategory({ name: "   ", description: "Sem nome" })).rejects.toThrow(/Nome da categoria/);
  });

  it("cria categoria removendo espacos extras", async () => {
    let receivedData: unknown;

    Object.defineProperty(prisma, "category", {
      value: {
        create: async ({ data }: { data: unknown }) => {
          receivedData = data;
          return categoryRecord({ name: "Informatica", description: "Notebooks" });
        }
      },
      configurable: true
    });

    const category = await createCategory({
      name: "  Informatica  ",
      description: "  Notebooks  ",
      isActive: false
    });

    expect(receivedData).toEqual({
      name: "Informatica",
      description: "Notebooks",
      isActive: false
    });
    expect(category.name).toBe("Informatica");
  });

  it("atualiza categoria existente", async () => {
    Object.defineProperty(prisma, "category", {
      value: {
        update: async () => categoryRecord({ name: "Casa" })
      },
      configurable: true
    });

    const category = await updateCategory("category-1", { name: "Casa" });

    expect(category?.name).toBe("Casa");
  });

  it("retorna null ao atualizar categoria inexistente", async () => {
    Object.defineProperty(prisma, "category", {
      value: {
        update: async () => {
          throw new Error("not found");
        }
      },
      configurable: true
    });

    const category = await updateCategory("missing", { name: "Teste" });

    expect(category).toBeNull();
  });

  it("remove categoria existente", async () => {
    Object.defineProperty(prisma, "category", {
      value: {
        delete: async () => categoryRecord()
      },
      configurable: true
    });

    await expect(deleteCategory("category-1")).resolves.toBe(true);
  });
});
