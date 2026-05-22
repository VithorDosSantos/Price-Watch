import { prisma } from "../prisma/client";

export type CategoryRecord = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryInput = {
  name: string;
  description: string;
  isActive?: boolean;
};

function mapCategory(record: {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): CategoryRecord {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    isActive: record.isActive,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

export async function listCategories() {
  const records = await prisma.category.findMany({
    orderBy: { createdAt: "desc" }
  });

  return records.map(mapCategory);
}

export async function createCategory(input: CategoryInput) {
  if (!input.name.trim()) {
    throw new Error("Nome da categoria é obrigatório.");
  }

  const record = await prisma.category.create({
    data: {
      name: input.name.trim(),
      description: input.description.trim(),
      isActive: input.isActive ?? true
    }
  });

  return mapCategory(record);
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  try {
    const record = await prisma.category.update({
      where: { id },
      data: {
        name: input.name?.trim(),
        description: input.description?.trim(),
        isActive: input.isActive
      }
    });

    return mapCategory(record);
  } catch {
    return null;
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}