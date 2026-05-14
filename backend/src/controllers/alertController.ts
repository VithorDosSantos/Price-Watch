import type { Request, Response } from "express";
import { createPriceAlert, listPriceAlerts } from "../services/alertService";

export async function createPriceAlertController(request: Request, response: Response) {
  try {
    const alert = await createPriceAlert({
      productId: request.body.productId,
      targetPrice: Number(request.body.targetPrice),
      email: request.body.email
    });

    return response.status(201).json(alert);
  } catch (error) {
    return response.status(400).json({ message: error instanceof Error ? error.message : "Erro ao criar alerta." });
  }
}

export async function listPriceAlertsController(_request: Request, response: Response) {
  const alerts = await listPriceAlerts();
  return response.json(alerts);
}
