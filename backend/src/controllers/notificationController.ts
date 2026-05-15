import type { Request, Response } from "express";

export function mercadoLivreNotificationHealthController(_request: Request, response: Response) {
  return response.json({
    status: "online",
    service: "Mercado Livre notifications"
  });
}

export function mercadoLivreNotificationController(request: Request, response: Response) {
  console.log("Mercado Livre notification received", {
    query: request.query,
    body: request.body,
    receivedAt: new Date().toISOString()
  });

  return response.status(200).json({
    received: true
  });
}
