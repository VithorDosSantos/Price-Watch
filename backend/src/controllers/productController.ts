import type { Request, Response } from "express";
import { getProductById, searchProducts } from "../services/productService";

export async function searchProductsController(request: Request, response: Response) {
  const query = String(request.query.q ?? "");
  try {
    const result = await searchProducts(query);
    return response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao consultar produtos";
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
