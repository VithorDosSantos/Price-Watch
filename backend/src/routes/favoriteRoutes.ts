import { Router } from "express";
import {
  createFavoriteController,
  deleteFavoriteController,
  listFavoritesController,
} from "../controllers/favoriteController";
import { authenticate } from "../middleware/authMiddleware";

export const favoriteRoutes = Router();

favoriteRoutes.use(authenticate);
favoriteRoutes.post("/", createFavoriteController);
favoriteRoutes.get("/", listFavoritesController);
favoriteRoutes.delete("/:id", deleteFavoriteController);
