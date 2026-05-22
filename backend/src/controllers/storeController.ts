import type { Request, Response } from "express";
import { createStore, deleteStore, listStores, updateStore } from "../services/storeService";

export async function listStoresController(_request: Request, response: Response) {
  return response.json(await listStores());
}

export async function createStoreController(request: Request, response: Response) {
  try {
    const store = await createStore({
      name: String(request.body.name ?? ""),
      website: String(request.body.website ?? ""),
      contactEmail: String(request.body.contactEmail ?? ""),
      isActive: request.body.isActive === undefined ? undefined : Boolean(request.body.isActive)
    });

    return response.status(201).json(store);
  } catch (error) {
    return response.status(400).json({ message: error instanceof Error ? error.message : "Erro ao criar loja." });
  }
}

export async function updateStoreController(request: Request, response: Response) {
  const store = await updateStore(request.params.id, {
    name: request.body.name,
    website: request.body.website,
    contactEmail: request.body.contactEmail,
    isActive: request.body.isActive
  });

  if (!store) {
    return response.status(404).json({ message: "Loja não encontrada." });
  }

  return response.json(store);
}

export async function deleteStoreController(request: Request, response: Response) {
  const removed = await deleteStore(request.params.id);

  if (!removed) {
    return response.status(404).json({ message: "Loja não encontrada." });
  }

  return response.status(204).send();
}