import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
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

export async function updateMeController(request: Request, response: Response) {
  const userId = (request as any).user?.id;
  if (!userId) return response.status(401).json({ message: "Unauthorized" });

  const { name, password } = request.body as { name?: string; password?: string };

  if (!name && !password) {
    return response.status(400).json({ message: "At least one field must be provided" });
  }

  const data: { name?: string; password?: string } = {};

  if (typeof name === "string" && name.trim()) {
    data.name = name.trim();
  }

  if (typeof password === "string" && password.trim()) {
    data.password = await bcrypt.hash(password, 10);
  }

  if (!Object.keys(data).length) {
    return response.status(400).json({ message: "At least one field must be provided" });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, name: true, role: true }
  });

  return response.json({ user });
}

export async function deleteMeController(request: Request, response: Response) {
  const userId = (request as any).user?.id;
  if (!userId) return response.status(401).json({ message: "Unauthorized" });

  await prisma.user.delete({ where: { id: userId } });
  return response.status(204).send();
}
