import { prisma } from "../prisma/client";
import { getProductById, upsertProduct } from "./productService";

export type CreateFavoriteInput = {
  productId: string;
  userName?: string;
};

export async function createFavorite(input: CreateFavoriteInput) {
  const product = await getProductById(input.productId);

  if (!product) {
    throw new Error("Produto não encontrado.");
  }

  const savedProductId = await upsertProduct(product);

  return prisma.favorite.create({
    data: {
      productId: savedProductId,
      userName: input.userName ?? "Aluno PriceWatch"
    },
    include: {
      product: true
    }
  });
}

export async function listFavorites() {
  return prisma.favorite.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      product: true
    }
  });
}
