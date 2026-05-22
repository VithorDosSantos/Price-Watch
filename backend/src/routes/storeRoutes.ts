import { Router } from "express";
import {
  createStoreController,
  deleteStoreController,
  listStoresController,
  updateStoreController
} from "../controllers/storeController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

export const storeRoutes = Router();

storeRoutes.get("/", listStoresController);
storeRoutes.post("/", authenticate, requireAdmin, createStoreController);
storeRoutes.put("/:id", authenticate, requireAdmin, updateStoreController);
storeRoutes.delete("/:id", authenticate, requireAdmin, deleteStoreController);