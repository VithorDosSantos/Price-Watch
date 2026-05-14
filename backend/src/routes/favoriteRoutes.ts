import { Router } from "express";
import { createFavoriteController, listFavoritesController } from "../controllers/favoriteController";

export const favoriteRoutes = Router();

favoriteRoutes.post("/", createFavoriteController);
favoriteRoutes.get("/", listFavoritesController);
