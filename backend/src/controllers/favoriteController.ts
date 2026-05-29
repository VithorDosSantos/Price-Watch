import type { Request, Response } from "express";
import {
  createFavorite,
  deleteFavorite,
  listFavorites,
} from "../services/favoriteService";

export async function createFavoriteController(
  request: Request,
  response: Response,
) {
  try {
    const userId = (request as any).user?.id as string | undefined;
    if (!userId) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const favorite = await createFavorite({
      productId: request.body.productId,
      userId,
      userName: request.body.userName,
    });

    return response.status(201).json(favorite);
  } catch (error) {
    return response.status(400).json({
      message:
        error instanceof Error ? error.message : "Erro ao favoritar produto.",
    });
  }
}

export async function listFavoritesController(
  request: Request,
  response: Response,
) {
  const userId = (request as any).user?.id as string | undefined;
  if (!userId) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const favorites = await listFavorites(userId);
  return response.json(favorites);
}

export async function deleteFavoriteController(
  request: Request,
  response: Response,
) {
  const userId = (request as any).user?.id as string | undefined;
  if (!userId) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const favorite = await deleteFavorite(request.params.id, userId);

  if (!favorite) {
    return response.status(404).json({ message: "Favorito não encontrado." });
  }

  return response.status(204).send();
}
