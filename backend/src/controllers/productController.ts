import type { Request, Response } from "express";
import { SerpApiError, getProductById, searchProducts } from "../services/productService";

export async function searchProductsController(request: Request, response: Response) {
  const query = String(request.query.q ?? "");
  const page = Number(request.query.page ?? 1);
  const limit = Number(request.query.limit ?? 8);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 24) {
    return response.status(400).json({
      message: "Parâmetros de paginação inválidos."
    });
  }

  try {
    const result = await searchProducts(query, page, limit);
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

export async function getProductDetailsController(request: Request, response: Response) {
  try {
    const product = await getProductById(request.params.id);
    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado." });
    }

    return response.json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao obter detalhes do produto";
    return response.status(502).json({ message });
  }
}
