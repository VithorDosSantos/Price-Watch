import { prisma } from "../prisma/client";
import { getProductById, upsertProduct } from "./productService";

export type CreatePriceAlertInput = {
  productId: string;
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
      targetPrice: input.targetPrice,
      email: input.email
    },
    include: {
      product: true
    }
  });
}

export async function listPriceAlerts() {
  return prisma.priceAlert.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      product: true
    }
  });
}
