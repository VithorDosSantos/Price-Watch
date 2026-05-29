import { Router } from "express";
import {
  createPriceAlertController,
  deletePriceAlertController,
  listPriceAlertsController,
  updatePriceAlertController,
} from "../controllers/alertController";
import { authenticate } from "../middleware/authMiddleware";

export const alertRoutes = Router();

alertRoutes.use(authenticate);
alertRoutes.post("/", createPriceAlertController);
alertRoutes.get("/", listPriceAlertsController);
alertRoutes.put("/:id", updatePriceAlertController);
alertRoutes.delete("/:id", deletePriceAlertController);
