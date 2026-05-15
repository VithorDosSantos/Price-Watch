import { Router } from "express";
import {
  mercadoLivreNotificationController,
  mercadoLivreNotificationHealthController
} from "../controllers/notificationController";

export const notificationRoutes = Router();

notificationRoutes.get("/mercadolivre", mercadoLivreNotificationHealthController);
notificationRoutes.post("/mercadolivre", mercadoLivreNotificationController);
