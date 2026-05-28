import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/mercadoLivreAuthService", () => ({
  getValidMercadoLivreAccessToken: vi.fn(async () => "saved-token")
}));

import { searchProducts } from "../../src/services/productService";

describe("productService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("retries search without auth when the authenticated request returns 403", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);

    fetchMock
      .mockResolvedValueOnce(new Response("forbidden", { status: 403 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            results: [
              {
                id: "MLB123",
                title: "Notebook Gamer",
                price: 3999,
                seller: { nickname: "Loja Exemplo" },
                thumbnail: "https://img.mercadolivre.com.br/item-I.jpg",
                permalink: "https://produto.mercadolivre.com.br/MLB123",
                category_id: "MLB5678"
              }
            ]
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
      );

    const result = await searchProducts("notebook");

    expect(fetchMock).toHaveBeenCalledTimes(2);

    const firstHeaders = new Headers(fetchMock.mock.calls[0][1]?.headers as HeadersInit);
    const secondHeaders = new Headers(fetchMock.mock.calls[1][1]?.headers as HeadersInit);

    expect(firstHeaders.get("Authorization")).toBe("Bearer saved-token");
    expect(secondHeaders.get("Authorization")).toBeNull();
    expect(result.source).toBe("mercado-livre");
    expect(result.products).toHaveLength(1);
    expect(result.products[0]).toMatchObject({
      id: "MLB123",
      name: "Notebook Gamer",
      storeName: "Loja Exemplo"
    });
  });
});