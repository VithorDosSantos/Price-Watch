import { Router } from "express";
import {
  deleteProductController,
  getProductDetailsController,
  searchProductsController,
  showcaseProductsController,
  updateProductController
} from "../controllers/productController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

export const productRoutes = Router();

productRoutes.get("/search", searchProductsController);
productRoutes.get("/showcase", showcaseProductsController);
productRoutes.get("/:id", getProductDetailsController);
productRoutes.put("/:id", authenticate, requireAdmin, updateProductController);
productRoutes.delete("/:id", authenticate, requireAdmin, deleteProductController);
