import type { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";
import { prisma } from "../prisma/client";

export async function registerController(request: Request, response: Response) {
  const { name, email, password } = request.body as { name?: string; email?: string; password?: string };

  if (!email || !password) {
    return response.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await registerUser({ name, email, password });
    return response.json(result);
  } catch (error) {
    return response.status(400).json({ message: error instanceof Error ? error.message : "Error" });
  }
}

export async function loginController(request: Request, response: Response) {
  const { email, password } = request.body as { email?: string; password?: string };

  if (!email || !password) {
    return response.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await loginUser(email, password);
    return response.json(result);
  } catch (error) {
    return response.status(401).json({ message: error instanceof Error ? error.message : "Invalid credentials" });
  }
}

export async function meController(request: Request, response: Response) {
  const userId = (request as any).user?.id;
  if (!userId) return response.status(401).json({ message: "Unauthorized" });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, role: true } });
  if (!user) return response.status(404).json({ message: "User not found" });

  return response.json({ user });
}
