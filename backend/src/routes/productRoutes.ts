import { Router } from "express";
import { getProductDetailsController, searchProductsController } from "../controllers/productController";

export const productRoutes = Router();

productRoutes.get("/search", searchProductsController);
productRoutes.get("/:id", getProductDetailsController);
