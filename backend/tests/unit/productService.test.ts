import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/prisma/client", () => ({
  prisma: {
    product: {
      upsert: vi.fn(async ({ create }: { create: { externalId: string } }) => ({
        id: `db-${create.externalId}`,
        externalId: create.externalId
      })),
      findFirst: vi.fn(async () => null)
    }
  }
}));

import { searchProducts } from "../../src/services/productService";

describe("productService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.stubEnv("SERPAPI_API_KEY", "test-key");
    vi.stubEnv("SERPAPI_API_URL", "https://serpapi.com/search");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("maps SerpApi shopping results into the product DTO", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          shopping_results: [
            {
              product_id: "123456",
              title: "Notebook Gamer",
              source: "Loja Exemplo",
              extracted_price: 3999,
              price: "R$ 3.999,00",
              thumbnail: "https://example.com/image.jpg",
              product_link: "https://example.com/produto"
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

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain("engine=google_shopping");
    expect(result.source).toBe("serpapi");
    expect(result.products).toHaveLength(1);
    expect(result.products[0]).toMatchObject({
      id: "123456",
      name: "Notebook Gamer",
      storeName: "Loja Exemplo",
      price: 3999,
      productUrl: "https://example.com/produto"
    });
  });
});