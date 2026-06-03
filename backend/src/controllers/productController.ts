import type { Request, Response } from "express";
import {
  createProduct,
  ProductDeleteConflictError,
  SerpApiError,
  getShowcaseProducts,
  getProductById,
  listProductComparableOffers,
  listProductPriceHistory,
  searchProducts,
  updateProduct,
  deleteProduct
} from "../services/productService";

export async function searchProductsController(request: Request, response: Response) {
  const query = typeof request.query.q === "string" ? request.query.q : "";
  const category = typeof request.query.category === "string" ? request.query.category : undefined;
  const page = Number(request.query.page ?? 1);
  const limit = Number(request.query.limit ?? 8);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 24) {
    return response.status(400).json({
      message: "Parâmetros de paginação inválidos."
    });
  }

  try {
    const result = await searchProducts(query, page, limit, category);
    return response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao consultar produtos";
    if (err instanceof SerpApiError) {
      return response.status(err.status).json({
        message,
        details: err.body
      });
    }

    return response.status(502).json({ message });
  }
}

export async function showcaseProductsController(request: Request, response: Response) {
  const page = Number(request.query.page ?? 1);
  const limit = Number(request.query.limit ?? 8);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 24) {
    return response.status(400).json({
      message: "Parâmetros de paginação inválidos."
    });
  }

  try {
    const result = await getShowcaseProducts(page, limit);
    return response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao carregar vitrine.";
    return response.status(502).json({ message });
  }
}

export async function getProductDetailsController(request: Request, response: Response) {
  try {
    const product = await getProductById(request.params.id);
    if (product) {
      return response.json(product);
    }

    return response.status(404).json({ message: "Produto não encontrado." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao obter detalhes do produto";
    return response.status(502).json({ message });
  }
}

function optionalNullableString(value: unknown, trim = false): string | null | undefined {
  if (value === undefined) return undefined;
  if (value) {
    const str = typeof value === "string" ? value : JSON.stringify(value);
    return trim ? str.trim() : str;
  }

  return null;
}

function isInvalidPrice(value: number): boolean {
  return !Number.isFinite(value) || value <= 0;
}

export async function updateProductController(request: Request, response: Response) {
  const userId = request.user?.id;
  if (userId === undefined) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const { name, price, imageUrl, productUrl, storeName, category } = request.body ?? {};

  if (name !== undefined && String(name).trim().length === 0) {
    return response.status(400).json({ message: "Nome do produto é obrigatório." });
  }

  const parsedPrice = price !== undefined ? Number(price) : undefined;

  if (parsedPrice !== undefined && isInvalidPrice(parsedPrice)) {
    return response.status(400).json({ message: "Preço inválido." });
  }

  try {
    const updated = await updateProduct(request.params.id, {
      name: name !== undefined ? String(name).trim() : undefined,
      price: parsedPrice,
      imageUrl: optionalNullableString(imageUrl),
      productUrl: optionalNullableString(productUrl),
      storeName: optionalNullableString(storeName, true),
      category: optionalNullableString(category, true)
    }, userId);

    if (updated) {
      return response.json(updated);
    }

    return response.status(404).json({ message: "Produto não encontrado." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao atualizar produto";
    return response.status(400).json({ message });
  }
}

export async function createProductController(request: Request, response: Response) {
  const userId = request.user?.id;
  if (userId === undefined) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const { name, price, imageUrl, productUrl, storeName, category } = request.body ?? {};

  if (String(name ?? "").trim().length === 0) {
    return response.status(400).json({ message: "Nome do produto é obrigatório." });
  }

  const parsedPrice = Number(price);

  if (isInvalidPrice(parsedPrice)) {
    return response.status(400).json({ message: "Preço inválido." });
  }

  try {
    const created = await createProduct({
      name: String(name),
      price: parsedPrice,
      imageUrl: optionalNullableString(imageUrl),
      productUrl: optionalNullableString(productUrl),
      storeName: optionalNullableString(storeName, true),
      category: optionalNullableString(category, true),
      ownerUserId: userId
    });

    return response.status(201).json(created);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao criar produto";
    return response.status(400).json({ message });
  }
}

export async function listProductHistoryController(request: Request, response: Response) {
  try {
    const records = await listProductPriceHistory(request.params.id);

    if (records === null) {
      return response.status(404).json({ message: "Produto não encontrado." });
    }

    return response.json(records);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao consultar histórico do produto";
    return response.status(400).json({ message });
  }
}

export async function listProductOffersController(request: Request, response: Response) {
  const limit = Number(request.query.limit ?? 5);

  if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
    return response.status(400).json({ message: "Parâmetro de limite inválido." });
  }

  try {
    const offers = await listProductComparableOffers(request.params.id, limit);

    if (offers === null) {
      return response.status(404).json({ message: "Produto não encontrado." });
    }

    return response.json(offers);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao consultar ofertas comparáveis";
    return response.status(400).json({ message });
  }
}

export async function deleteProductController(request: Request, response: Response) {
  try {
    const result = await deleteProduct(request.params.id);

    if (result) {
      return response.status(204).send();
    }

    return response.status(404).json({ message: "Produto não encontrado." });
  } catch (err) {
    if (err instanceof ProductDeleteConflictError) {
      return response.status(409).json({
        message: err.message,
        details: err.dependencySummary
      });
    }

    const message = err instanceof Error ? err.message : "Erro ao remover produto";
    return response.status(400).json({ message });
  }
}
