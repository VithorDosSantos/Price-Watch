import { Router } from "express";
import { deleteMeController, loginController, meController, registerController, updateMeController } from "../controllers/localAuthController";
import { authenticate } from "../middleware/authMiddleware";

export const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login/local", loginController);
authRoutes.get("/me", authenticate, meController);
authRoutes.patch("/me", authenticate, updateMeController);
authRoutes.delete("/me", authenticate, deleteMeController);
