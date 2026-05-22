import type { Request, Response } from "express";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../services/categoryService";

export async function listCategoriesController(_request: Request, response: Response) {
  return response.json(await listCategories());
}

export async function createCategoryController(request: Request, response: Response) {
  try {
    const category = await createCategory({
      name: String(request.body.name ?? ""),
      description: String(request.body.description ?? ""),
      isActive: request.body.isActive === undefined ? undefined : Boolean(request.body.isActive)
    });

    return response.status(201).json(category);
  } catch (error) {
    return response.status(400).json({ message: error instanceof Error ? error.message : "Erro ao criar categoria." });
  }
}

export async function updateCategoryController(request: Request, response: Response) {
  const category = await updateCategory(request.params.id, {
    name: request.body.name,
    description: request.body.description,
    isActive: request.body.isActive
  });

  if (!category) {
    return response.status(404).json({ message: "Categoria não encontrada." });
  }

  return response.json(category);
}

export async function deleteCategoryController(request: Request, response: Response) {
  const removed = await deleteCategory(request.params.id);

  if (!removed) {
    return response.status(404).json({ message: "Categoria não encontrada." });
  }

  return response.status(204).send();
}