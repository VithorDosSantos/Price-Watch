import type { Request, Response } from "express";
import { prisma } from "../prisma/client";

export async function listUsers(request: Request, response: Response) {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
  return response.json({ users });
}

export async function updateUserRole(request: Request, response: Response) {
  const { id } = request.params as { id: string };
  const { role } = request.body as { role?: string };

  if (!role || (role !== "ADMIN" && role !== "USER")) {
    return response.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await prisma.user.update({ where: { id }, data: { role: role as any }, select: { id: true, email: true, name: true, role: true } });
    return response.json({ user });
  } catch (err) {
    console.error("Error updating user", err);
    return response.status(500).json({ message: "Error updating user" });
  }
}
