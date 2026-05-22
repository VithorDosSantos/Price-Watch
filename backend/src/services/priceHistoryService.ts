import { prisma } from "../prisma/client";

export type PriceHistoryRecord = {
  id: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  capturedAt: string;
};

export type PriceHistoryInput = {
  productName: string;
  oldPrice: number;
  newPrice: number;
  capturedAt?: string;
};

function mapPriceHistory(record: {
  id: string;
  productName: string;
  oldPrice: { toNumber(): number } | number;
  newPrice: { toNumber(): number } | number;
  capturedAt: Date;
}): PriceHistoryRecord {
  return {
    id: record.id,
    productName: record.productName,
    oldPrice: typeof record.oldPrice === "number" ? record.oldPrice : record.oldPrice.toNumber(),
    newPrice: typeof record.newPrice === "number" ? record.newPrice : record.newPrice.toNumber(),
    capturedAt: record.capturedAt.toISOString()
  };
}

export async function listPriceHistoryRecords() {
  const records = await prisma.priceHistoryEntry.findMany({
    orderBy: { capturedAt: "desc" }
  });

  return records.map(mapPriceHistory);
}

export async function createPriceHistoryRecord(input: PriceHistoryInput) {
  if (!input.productName.trim()) {
    throw new Error("Nome do produto é obrigatório.");
  }

  if (Number.isNaN(input.oldPrice) || Number.isNaN(input.newPrice)) {
    throw new Error("Os preços precisam ser numéricos.");
  }

  const record = await prisma.priceHistoryEntry.create({
    data: {
      productName: input.productName.trim(),
      oldPrice: input.oldPrice,
      newPrice: input.newPrice,
      capturedAt: input.capturedAt ? new Date(input.capturedAt) : undefined
    }
  });

  return mapPriceHistory(record);
}

export async function updatePriceHistoryRecord(id: string, input: Partial<PriceHistoryInput>) {
  try {
    const record = await prisma.priceHistoryEntry.update({
      where: { id },
      data: {
        productName: input.productName?.trim(),
        oldPrice: input.oldPrice,
        newPrice: input.newPrice,
        capturedAt: input.capturedAt ? new Date(input.capturedAt) : undefined
      }
    });

    return mapPriceHistory(record);
  } catch {
    return null;
  }
}

export async function deletePriceHistoryRecord(id: string) {
  try {
    await prisma.priceHistoryEntry.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}