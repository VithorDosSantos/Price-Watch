import { prisma } from "../prisma/client";
import { getProductById, upsertProduct } from "./productService";

export type CreatePriceAlertInput = {
  productId: string;
  userId: string;
  targetPrice: number;
  email: string;
};

export async function createPriceAlert(input: CreatePriceAlertInput) {
  const product = await getProductById(input.productId);

  if (!product) {
    throw new Error("Produto não encontrado.");
  }

  const savedProductId = await upsertProduct(product);

  return prisma.priceAlert.create({
    data: {
      productId: savedProductId,
      userId: input.userId,
      targetPrice: input.targetPrice,
      email: input.email,
    },
    include: {
      product: true,
    },
  });
}

export async function listPriceAlerts(userId: string) {
  return prisma.priceAlert.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId,
    },
    include: {
      product: true,
    },
  });
}

export type UpdatePriceAlertInput = {
  targetPrice?: number;
  email?: string;
  isActive?: boolean;
};

export async function updatePriceAlert(
  id: string,
  input: UpdatePriceAlertInput,
  userId: string,
) {
  const alert = await prisma.priceAlert.findFirst({
    where: { id, userId },
  });

  if (!alert) {
    return null;
  }

  return prisma.priceAlert.update({
    where: { id },
    data: {
      targetPrice: input.targetPrice ?? Number(alert.targetPrice),
      email: input.email ?? alert.email,
      isActive: input.isActive ?? alert.isActive,
    },
    include: { product: true },
  });
}

export async function deletePriceAlert(id: string, userId: string) {
  const alert = await prisma.priceAlert.findFirst({
    where: { id, userId },
  });

  if (!alert) {
    return null;
  }

  await prisma.priceAlert.delete({ where: { id } });

  return alert;
}
