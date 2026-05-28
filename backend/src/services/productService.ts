import { prisma } from "../prisma/client";

type SerpApiShoppingResult = {
  title: string;
  product_id?: string;
  link?: string;
  product_link?: string;
  source?: string;
  price?: string;
  extracted_price?: number;
  thumbnail?: string;
  serpapi_thumbnail?: string;
};

type SerpApiSearchResponse = {
  shopping_results?: SerpApiShoppingResult[];
  inline_shopping_results?: SerpApiShoppingResult[];
  categorized_shopping_results?: Array<{
    shopping_results?: SerpApiShoppingResult[];
  }>;
  error?: string;
};

export type ProductDTO = {
  id: string;
  externalId: string;
  name: string;
  price: number;
  imageUrl?: string;
  productUrl?: string;
  storeName?: string;
  category?: string;
};

export class SerpApiError extends Error {
  constructor(public status: number, public body: string) {
    super(`SerpApiError ${status}`);
    this.name = "SerpApiError";
  }
}

function getSerpApiBaseUrl() {
  return process.env.SERPAPI_API_URL ?? "https://serpapi.com/search";
}

function getSerpApiKey() {
  return process.env.SERPAPI_API_KEY ?? "";
}

function parsePrice(value?: string): number {
  if (!value) {
    return 0;
  }

  const cleaned = value.replace(/[^\d,.-]/g, "").trim();

  if (!cleaned) {
    return 0;
  }

  if (cleaned.includes(",") && cleaned.includes(".")) {
    const commaIndex = cleaned.lastIndexOf(",");
    const dotIndex = cleaned.lastIndexOf(".");

    if (commaIndex > dotIndex) {
      return Number(cleaned.replace(/\./g, "").replace(",", ".")) || 0;
    }

    return Number(cleaned.replace(/,/g, "")) || 0;
  }

  if (cleaned.includes(",")) {
    return Number(cleaned.replace(/\./g, "").replace(",", ".")) || 0;
  }

  return Number(cleaned) || 0;
}

function collectSerpApiResults(data: SerpApiSearchResponse): SerpApiShoppingResult[] {
  const results: SerpApiShoppingResult[] = [];

  if (Array.isArray(data.shopping_results)) {
    results.push(...data.shopping_results);
  }

  if (Array.isArray(data.inline_shopping_results)) {
    results.push(...data.inline_shopping_results);
  }

  if (Array.isArray(data.categorized_shopping_results)) {
    for (const category of data.categorized_shopping_results) {
      if (Array.isArray(category.shopping_results)) {
        results.push(...category.shopping_results);
      }
    }
  }

  return results;
}

function mapSerpApiItem(item: SerpApiShoppingResult): ProductDTO {
  const externalId = item.product_id ?? item.product_link ?? item.link ?? item.title;

  return {
    id: externalId,
    externalId,
    name: item.title,
    price: item.extracted_price ?? parsePrice(item.price),
    imageUrl: item.thumbnail ?? item.serpapi_thumbnail,
    productUrl: item.link ?? item.product_link,
    storeName: item.source ?? "SerpApi",
    category: undefined
  };
}

async function fetchSerpApiSearch(query: string): Promise<Response> {
  const apiKey = getSerpApiKey();

  if (!apiKey) {
    throw new SerpApiError(500, "SERPAPI_API_KEY não configurada.");
  }

  const url = new URL(getSerpApiBaseUrl());
  url.searchParams.set("engine", "google_shopping");
  url.searchParams.set("q", query);
  url.searchParams.set("gl", "br");
  url.searchParams.set("hl", "pt-BR");
  url.searchParams.set("api_key", apiKey);

  return fetch(url.toString(), {
    headers: {
      Accept: "application/json"
    }
  });
}

async function searchSerpApi(query: string): Promise<ProductDTO[]> {
  const response = await fetchSerpApiSearch(query);

  if (!response.ok) {
    const details = await response.text();
    throw new SerpApiError(response.status, details || `SerpApi retornou ${response.status}`);
  }

  const data = (await response.json()) as SerpApiSearchResponse;

  if (data.error) {
    throw new SerpApiError(502, data.error);
  }

  return collectSerpApiResults(data).map(mapSerpApiItem);
}

type ProductSearchResult = {
  source: "serpapi" | "mock";
  products: ProductDTO[];
  message?: string;
};

export async function searchProducts(query: string): Promise<ProductSearchResult> {
  if (!query.trim()) {
    return { source: "serpapi", products: [] };
  }

  const products = await searchSerpApi(query);

  await Promise.allSettled(products.map((product) => upsertProduct(product)));

  return { source: "serpapi", products };
}

export async function getProductById(id: string): Promise<ProductDTO | null> {
  const savedProduct = await prisma.product.findFirst({
    where: {
      OR: [{ id }, { externalId: id }]
    }
  });

  if (savedProduct) {
    return {
      id: savedProduct.id,
      externalId: savedProduct.externalId,
      name: savedProduct.name,
      price: Number(savedProduct.price),
      imageUrl: savedProduct.imageUrl ?? undefined,
      productUrl: savedProduct.productUrl ?? undefined,
      storeName: savedProduct.storeName ?? undefined,
      category: savedProduct.category ?? undefined
    };
  }

  return null;
}

export async function upsertProduct(product: ProductDTO): Promise<string> {
  const savedProduct = await prisma.product.upsert({
    where: { externalId: product.externalId },
    update: {
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      storeName: product.storeName,
      category: product.category
    },
    create: {
      externalId: product.externalId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      storeName: product.storeName,
      category: product.category
    }
  });

  return savedProduct.id;
}
