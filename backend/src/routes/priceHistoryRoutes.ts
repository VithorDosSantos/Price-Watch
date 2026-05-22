import { Router } from "express";
import {
  createPriceHistoryController,
  deletePriceHistoryController,
  listPriceHistoryController,
  updatePriceHistoryController
} from "../controllers/priceHistoryController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

export const priceHistoryRoutes = Router();

priceHistoryRoutes.get("/", listPriceHistoryController);
priceHistoryRoutes.post("/", authenticate, requireAdmin, createPriceHistoryController);
priceHistoryRoutes.put("/:id", authenticate, requireAdmin, updatePriceHistoryController);
priceHistoryRoutes.delete("/:id", authenticate, requireAdmin, deletePriceHistoryController);