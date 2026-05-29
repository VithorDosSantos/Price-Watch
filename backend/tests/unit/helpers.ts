import { vi } from "vitest";

export const mockProduct = {
  id: "p1",
  externalId: "e1",
  name: "Product",
  price: 100,
  imageUrl: null,
  productUrl: null,
  storeName: null,
  category: null,
};

export function mockProductNotFound(mockedGetProductById: ReturnType<typeof vi.fn>) {
  mockedGetProductById.mockResolvedValueOnce(null);
}

export function mockProductFound(
  mockedGetProductById: ReturnType<typeof vi.fn>,
  mockedUpsertProduct: ReturnType<typeof vi.fn>,
  savedId = "saved-p1",
) {
  mockedGetProductById.mockResolvedValueOnce(mockProduct);
  mockedUpsertProduct.mockResolvedValueOnce(savedId);
}
