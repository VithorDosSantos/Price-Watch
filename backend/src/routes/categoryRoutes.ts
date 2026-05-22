import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  listCategoriesController,
  updateCategoryController
} from "../controllers/categoryController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

export const categoryRoutes = Router();

categoryRoutes.get("/", listCategoriesController);
categoryRoutes.post("/", authenticate, requireAdmin, createCategoryController);
categoryRoutes.put("/:id", authenticate, requireAdmin, updateCategoryController);
categoryRoutes.delete("/:id", authenticate, requireAdmin, deleteCategoryController);