import { Router } from "express";
import { createPriceAlertController, listPriceAlertsController } from "../controllers/alertController";

export const alertRoutes = Router();

alertRoutes.post("/", createPriceAlertController);
alertRoutes.get("/", listPriceAlertsController);
