import type { Request, Response } from "express";
import {
  createPriceAlert,
  deletePriceAlert,
  listPriceAlerts,
  updatePriceAlert,
} from "../services/alertService";

export async function createPriceAlertController(
  request: Request,
  response: Response,
) {
  try {
    const userId = (request as any).user?.id as string | undefined;
    if (userId === undefined) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const alert = await createPriceAlert({
      productId: request.body.productId,
      userId,
      targetPrice: Number(request.body.targetPrice),
      email: request.body.email,
    });

    return response.status(201).json(alert);
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao criar alerta.",
    });
  }
}

export async function listPriceAlertsController(
  request: Request,
  response: Response,
) {
  const userId = (request as any).user?.id as string | undefined;
  if (userId === undefined) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const alerts = await listPriceAlerts(userId);
  return response.json(alerts);
}

export async function updatePriceAlertController(
  request: Request,
  response: Response,
) {
  const userId = (request as any).user?.id as string | undefined;
  if (userId === undefined) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const { targetPrice, email, isActive } = request.body ?? {};
  const parsedTargetPrice =
    targetPrice !== undefined ? Number(targetPrice) : undefined;

  if (
    parsedTargetPrice !== undefined &&
    (!Number.isFinite(parsedTargetPrice) || parsedTargetPrice <= 0)
  ) {
    return response.status(400).json({ message: "Preço alvo inválido." });
  }

  if (email !== undefined && String(email).trim().length === 0) {
    return response.status(400).json({ message: "E-mail inválido." });
  }

  const updated = await updatePriceAlert(
    request.params.id,
    {
      targetPrice: parsedTargetPrice,
      email: email !== undefined ? String(email).trim() : undefined,
      isActive: typeof isActive === "boolean" ? isActive : undefined,
    },
    userId,
  );

  if (updated) {
    return response.json(updated);
  }

  return response.status(404).json({ message: "Alerta não encontrado." });
}

export async function deletePriceAlertController(
  request: Request,
  response: Response,
) {
  const userId = (request as any).user?.id as string | undefined;
  if (userId === undefined) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const deleted = await deletePriceAlert(request.params.id, userId);

  if (deleted) {
    return response.status(204).send();
  }

  return response.status(404).json({ message: "Alerta não encontrado." });
}
