import type { Request, Response } from "express";
import {
  createPriceHistoryRecord,
  deletePriceHistoryRecord,
  listPriceHistoryRecords,
  updatePriceHistoryRecord
} from "../services/priceHistoryService";

export async function listPriceHistoryController(_request: Request, response: Response) {
  return response.json(await listPriceHistoryRecords());
}

export async function createPriceHistoryController(request: Request, response: Response) {
  try {
    const record = await createPriceHistoryRecord({
      productName: String(request.body.productName ?? ""),
      oldPrice: Number(request.body.oldPrice),
      newPrice: Number(request.body.newPrice),
      capturedAt: request.body.capturedAt ? String(request.body.capturedAt) : undefined
    });

    return response.status(201).json(record);
  } catch (error) {
    return response.status(400).json({ message: error instanceof Error ? error.message : "Erro ao criar histórico." });
  }
}

export async function updatePriceHistoryController(request: Request, response: Response) {
  const record = await updatePriceHistoryRecord(request.params.id, {
    productName: request.body.productName,
    oldPrice: request.body.oldPrice === undefined ? undefined : Number(request.body.oldPrice),
    newPrice: request.body.newPrice === undefined ? undefined : Number(request.body.newPrice),
    capturedAt: request.body.capturedAt
  });

  if (!record) {
    return response.status(404).json({ message: "Registro de histórico não encontrado." });
  }

  return response.json(record);
}

export async function deletePriceHistoryController(request: Request, response: Response) {
  const removed = await deletePriceHistoryRecord(request.params.id);

  if (!removed) {
    return response.status(404).json({ message: "Registro de histórico não encontrado." });
  }

  return response.status(204).send();
}