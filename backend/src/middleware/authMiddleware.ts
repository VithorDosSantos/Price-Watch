import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "change_this_to_a_secure_value";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = String(req.headers.authorization ?? "");
  if (!auth.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });

  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = { id: payload.userId, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  if (user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });
  return next();
}
