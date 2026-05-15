import { Router } from "express";
import { mercadoLivreCallbackController, mercadoLivreLoginController } from "../controllers/authController";

export const authRoutes = Router();

authRoutes.get("/login", mercadoLivreLoginController);
authRoutes.get("/callback", mercadoLivreCallbackController);
