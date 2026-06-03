import type { Request, Response } from "express";
import {
  createStore,
  deleteStoreOwned,
  listStores,
  updateStore
} from "../services/storeService";

function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }

  return Boolean(value);
}

export async function listStoresController(_request: Request, response: Response) {
  return response.json(await listStores());
}

export async function createStoreController(request: Request, response: Response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const store = await createStore({
      name: String(request.body.name ?? ""),
      website: String(request.body.website ?? ""),
      contactEmail: String(request.body.contactEmail ?? ""),
      userId,
      isActive: parseOptionalBoolean(request.body.isActive)
    });

    return response.status(201).json(store);
  } catch (error) {
    return response.status(400).json({ message: error instanceof Error ? error.message : "Erro ao criar loja." });
  }
}

export async function updateStoreController(request: Request, response: Response) {
  const userId = request.user?.id;
  if (!userId) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const store = await updateStore(request.params.id, {
    name: request.body.name,
    website: request.body.website,
    contactEmail: request.body.contactEmail,
    isActive: parseOptionalBoolean(request.body.isActive)
  }, userId);

  if (!store) {
    return response.status(404).json({ message: "Loja não encontrada." });
  }

  return response.json(store);
}

export async function deleteStoreController(request: Request, response: Response) {
  const userId = request.user?.id;
  if (!userId) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const removed = await deleteStoreOwned(request.params.id, userId);

  if (!removed) {
    return response.status(404).json({ message: "Loja não encontrada." });
  }

  return response.status(204).send();
}