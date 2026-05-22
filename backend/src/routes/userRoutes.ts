import { Router } from "express";
import { listUsers, updateUserRole } from "../controllers/userController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

export const userRoutes = Router();

userRoutes.use(authenticate, requireAdmin);

userRoutes.get("/", listUsers);
userRoutes.patch("/:id/role", updateUserRole);
