import type { Request, Response } from "express";
import {
  ProductDeleteConflictError,
  SerpApiError,
  getProductById,
  searchProducts,
  updateProduct,
  deleteProduct,
} from "../services/productService";

export async function searchProductsController(
  request: Request,
  response: Response,
) {
  const query = String(request.query.q ?? "");
  const page = Number(request.query.page ?? 1);
  const limit = Number(request.query.limit ?? 8);

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 24
  ) {
    return response.status(400).json({
      message: "Parâmetros de paginação inválidos.",
    });
  }

  try {
    const result = await searchProducts(query, page, limit);
    return response.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao consultar produtos";
    if (err instanceof SerpApiError) {
      return response.status(err.status).json({
        message,
        details: err.body,
      });
    }

    return response.status(502).json({ message });
  }
}

export async function getProductDetailsController(
  request: Request,
  response: Response,
) {
  try {
    const product = await getProductById(request.params.id);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado." });
    }

    return response.json(product);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao obter detalhes do produto";
    return response.status(502).json({ message });
  }
}

export async function updateProductController(
  request: Request,
  response: Response,
) {
  const { name, price, imageUrl, productUrl, storeName, category } =
    request.body ?? {};

  if (name !== undefined && String(name).trim().length === 0) {
    return response
      .status(400)
      .json({ message: "Nome do produto é obrigatório." });
  }

  const parsedPrice = price !== undefined ? Number(price) : undefined;

  if (
    parsedPrice !== undefined &&
    (!Number.isFinite(parsedPrice) || parsedPrice <= 0)
  ) {
    return response.status(400).json({ message: "Preço inválido." });
  }

  try {
    const updated = await updateProduct(request.params.id, {
      name: name !== undefined ? String(name).trim() : undefined,
      price: parsedPrice,
      imageUrl:
        imageUrl !== undefined
          ? imageUrl
            ? String(imageUrl)
            : null
          : undefined,
      productUrl:
        productUrl !== undefined
          ? productUrl
            ? String(productUrl)
            : null
          : undefined,
      storeName:
        storeName !== undefined
          ? storeName
            ? String(storeName).trim()
            : null
          : undefined,
      category:
        category !== undefined
          ? category
            ? String(category).trim()
            : null
          : undefined,
    });

    if (!updated) {
      return response.status(404).json({ message: "Produto não encontrado." });
    }

    return response.json(updated);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao atualizar produto";
    return response.status(400).json({ message });
  }
}

export async function deleteProductController(
  request: Request,
  response: Response,
) {
  try {
    const result = await deleteProduct(request.params.id);

    if (!result) {
      return response.status(404).json({ message: "Produto não encontrado." });
    }

    return response.status(204).send();
  } catch (err) {
    if (err instanceof ProductDeleteConflictError) {
      return response.status(409).json({
        message: err.message,
        details: err.dependencySummary,
      });
    }

    const message =
      err instanceof Error ? err.message : "Erro ao remover produto";
    return response.status(400).json({ message });
  }
}
