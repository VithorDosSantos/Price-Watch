import { prisma } from "../prisma/client";

export type StoreRecord = {
  id: string;
  name: string;
  website: string;
  contactEmail: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoreInput = {
  name: string;
  website: string;
  contactEmail: string;
  isActive?: boolean;
};

function mapStore(record: {
  id: string;
  name: string;
  website: string;
  contactEmail: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): StoreRecord {
  return {
    id: record.id,
    name: record.name,
    website: record.website,
    contactEmail: record.contactEmail,
    isActive: record.isActive,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

export async function listStores() {
  const records = await prisma.store.findMany({
    orderBy: { createdAt: "desc" }
  });

  return records.map(mapStore);
}

export async function createStore(input: StoreInput) {
  if (!input.name.trim()) {
    throw new Error("Nome da loja é obrigatório.");
  }

  if (!input.website.trim()) {
    throw new Error("Website da loja é obrigatório.");
  }

  const record = await prisma.store.create({
    data: {
      name: input.name.trim(),
      website: input.website.trim(),
      contactEmail: input.contactEmail.trim(),
      isActive: input.isActive ?? true
    }
  });

  return mapStore(record);
}

export async function updateStore(id: string, input: Partial<StoreInput>) {
  try {
    const record = await prisma.store.update({
      where: { id },
      data: {
        name: input.name?.trim(),
        website: input.website?.trim(),
        contactEmail: input.contactEmail?.trim(),
        isActive: input.isActive
      }
    });

    return mapStore(record);
  } catch {
    return null;
  }
}

export async function deleteStore(id: string) {
  try {
    await prisma.store.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}