import { Router } from "express";
import {
  mercadoLivreCallbackController,
  mercadoLivreLoginController,
  mercadoLivreLoginUrlController,
  mercadoLivreStatusController
} from "../controllers/authController";
import { registerController, loginController, meController } from "../controllers/localAuthController";
import { authenticate } from "../middleware/authMiddleware";

export const authRoutes = Router();

authRoutes.get("/login", mercadoLivreLoginController);
authRoutes.get("/login/url", mercadoLivreLoginUrlController);
authRoutes.get("/callback", mercadoLivreCallbackController);
authRoutes.get("/mercadolivre/status", mercadoLivreStatusController);
authRoutes.post("/register", registerController);
authRoutes.post("/login/local", loginController);
authRoutes.get("/me", authenticate, meController);
