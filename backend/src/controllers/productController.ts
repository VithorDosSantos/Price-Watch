import type { Request, Response } from "express";
import { getProductById, searchProducts } from "../services/productService";

export async function searchProductsController(request: Request, response: Response) {
  const query = String(request.query.q ?? "");
  const result = await searchProducts(query);

  return response.json(result);
}

export async function getProductDetailsController(request: Request, response: Response) {
  const product = await getProductById(request.params.id);

  if (!product) {
    return response.status(404).json({ message: "Produto não encontrado." });
  }

  return response.json(product);
}
