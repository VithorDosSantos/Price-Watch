import type { Request, Response } from "express";
import { createFavorite, listFavorites } from "../services/favoriteService";

export async function createFavoriteController(request: Request, response: Response) {
  try {
    const favorite = await createFavorite({
      productId: request.body.productId,
      userName: request.body.userName
    });

    return response.status(201).json(favorite);
  } catch (error) {
    return response.status(400).json({ message: error instanceof Error ? error.message : "Erro ao favoritar produto." });
  }
}

export async function listFavoritesController(_request: Request, response: Response) {
  const favorites = await listFavorites();
  return response.json(favorites);
}
