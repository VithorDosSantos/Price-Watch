import { prisma } from "../prisma/client";
import { getProductById, upsertProduct } from "./productService";

export type CreateFavoriteInput = {
  productId: string;
  userId: string;
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
      userId: input.userId,
      userName: input.userName ?? "Aluno PriceWatch",
    },
    include: {
      product: true,
    },
  });
}

export async function listFavorites(userId: string) {
  return prisma.favorite.findMany({
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

export async function deleteFavorite(id: string, userId: string) {
  const favorite = await prisma.favorite.findFirst({
    where: { id, userId },
    include: { product: true },
  });

  if (!favorite) {
    return null;
  }

  await prisma.favorite.delete({ where: { id } });

  return favorite;
}
