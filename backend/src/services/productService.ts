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
  serpapi_pagination?: {
    next_link?: string;
    previous_link?: string;
  };
  pagination?: {
    next?: string;
    previous?: string;
  };
  search_information?: {
    total_results?: number;
  };
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
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`SerpApiError ${status}`);
    this.name = "SerpApiError";
  }
}

export class ProductDeleteConflictError extends Error {
  constructor(public dependencySummary: string) {
    super("Produto possui dependências ativas.");
    this.name = "ProductDeleteConflictError";
  }
}

function getSerpApiBaseUrl() {
  return process.env.SERPAPI_API_URL ?? "https://serpapi.com/search.json";
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
      return Number(cleaned.replaceAll(".", "").replace(",", ".")) || 0;
    }

    return Number(cleaned.replaceAll(",", "")) || 0;
  }

  if (cleaned.includes(",")) {
    return Number(cleaned.replaceAll(".", "").replace(",", ".")) || 0;
  }

  return Number(cleaned) || 0;
}

function collectSerpApiResults(
  data: SerpApiSearchResponse,
): SerpApiShoppingResult[] {
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

function hasNextPage(data: SerpApiSearchResponse): boolean {
  return Boolean(data.serpapi_pagination?.next_link || data.pagination?.next);
}

function hasPreviousPage(data: SerpApiSearchResponse): boolean {
  return Boolean(
    data.serpapi_pagination?.previous_link || data.pagination?.previous,
  );
}

function mapSerpApiItem(item: SerpApiShoppingResult): ProductDTO {
  const externalId =
    item.product_id ?? item.product_link ?? item.link ?? item.title;

  return {
    id: externalId,
    externalId,
    name: item.title,
    price: item.extracted_price ?? parsePrice(item.price),
    imageUrl: item.thumbnail ?? item.serpapi_thumbnail,
    productUrl: item.link ?? item.product_link,
    storeName: item.source ?? "SerpApi",
    category: undefined,
  };
}

function normalizeText(value?: string | null): string {
  return (value ?? "").trim().toLowerCase();
}

function normalizeProductUrl(value?: string | null): string {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    const normalized = `${url.origin}${url.pathname}${url.search}`;
    return normalized.toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}

async function fetchSerpApiSearch(
  query: string,
  start: number,
): Promise<Response> {
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

  if (start > 0) {
    url.searchParams.set("start", String(start));
  }

  return fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });
}

async function searchSerpApi(
  query: string,
  page: number,
  limit: number,
): Promise<{
  products: ProductDTO[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalResults?: number;
}> {
  const start = Math.max(page - 1, 0) * limit;
  const response = await fetchSerpApiSearch(query, start);

  if (!response.ok) {
    const details = await response.text();
    const errorBody = details.trim() || `SerpApi retornou ${response.status}`;
    throw new SerpApiError(response.status, errorBody);
  }

  const data = (await response.json()) as SerpApiSearchResponse;

  if (data.error) {
    throw new SerpApiError(502, data.error);
  }

  return {
    products: collectSerpApiResults(data).slice(0, limit).map(mapSerpApiItem),
    hasNextPage:
      hasNextPage(data) || collectSerpApiResults(data).length >= limit,
    hasPreviousPage: hasPreviousPage(data),
    totalResults: data.search_information?.total_results,
  };
}

type ProductSearchResult = {
  source: "serpapi" | "mock";
  products: ProductDTO[];
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalResults?: number;
  totalPages?: number;
  message?: string;
};

export async function searchProducts(
  query: string,
  page = 1,
  limit = 8,
): Promise<ProductSearchResult> {
  if (!query.trim()) {
    return {
      source: "serpapi",
      products: [],
      page: 1,
      limit,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const searchResult = await searchSerpApi(query, page, limit);

  await Promise.allSettled(
    searchResult.products.map((product) => upsertProduct(product)),
  );

  const savedProducts = await prisma.product.findMany({
    where: {
      externalId: {
        in: searchResult.products.map((product) => product.externalId),
      },
    },
    select: {
      id: true,
      externalId: true,
      name: true,
      price: true,
      imageUrl: true,
      productUrl: true,
      storeName: true,
      category: true,
      isManual: true,
      isDeleted: true,
    },
  });

  const deletedProducts = await prisma.product.findMany({
    where: {
      isDeleted: true,
    },
    select: {
      productUrl: true,
      name: true,
      storeName: true,
    },
  });

  const deletedUrls = new Set(
    deletedProducts
      .map((product) => normalizeProductUrl(product.productUrl))
      .filter((value) => value.length > 0),
  );

  const savedByExternalId = new Map(
    savedProducts.map((product) => [product.externalId, product]),
  );

  const productsToReturn = searchResult.products.map((product) => {
    const saved = savedByExternalId.get(product.externalId);
    const productUrl = normalizeProductUrl(product.productUrl);
    if (productUrl && deletedUrls.has(productUrl)) {
      return null;
    }

    if (saved?.isDeleted) {
      return null;
    }

    if (!saved?.isManual) {
      return product;
    }

    return {
      id: saved.id,
      externalId: saved.externalId,
      name: saved.name,
      price: Number(saved.price),
      imageUrl: saved.imageUrl ?? undefined,
      productUrl: saved.productUrl ?? undefined,
      storeName: saved.storeName ?? undefined,
      category: saved.category ?? undefined,
    };
  });

  const totalResults = searchResult.totalResults;

  return {
    source: "serpapi",
    products: productsToReturn.filter(Boolean) as ProductDTO[],
    page,
    limit,
    hasNextPage: searchResult.hasNextPage,
    hasPreviousPage: searchResult.hasPreviousPage,
    totalResults,
    totalPages: totalResults
      ? Math.max(1, Math.ceil(totalResults / limit))
      : undefined,
  };
}

export async function getProductById(id: string): Promise<ProductDTO | null> {
  const savedProduct = await prisma.product.findFirst({
    where: {
      OR: [{ id }, { externalId: id }],
      isDeleted: false,
    },
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
      category: savedProduct.category ?? undefined,
    };
  }

  return null;
}

export async function upsertProduct(product: ProductDTO): Promise<string> {
  const existing = await prisma.product.findUnique({
    where: { externalId: product.externalId },
  });

  if (
    existing &&
    ((existing as { isManual?: boolean }).isManual ||
      (existing as { isDeleted?: boolean }).isDeleted)
  ) {
    return existing.id;
  }

  const savedProduct = await prisma.product.upsert({
    where: { externalId: product.externalId },
    update: {
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      storeName: product.storeName,
      category: product.category,
      isManual: false,
    },
    create: {
      externalId: product.externalId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      storeName: product.storeName,
      category: product.category,
      isManual: false,
    },
  });

  return savedProduct.id;
}

export type UpdateProductInput = {
  name?: string;
  price?: number;
  imageUrl?: string | null;
  productUrl?: string | null;
  storeName?: string | null;
  category?: string | null;
};

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<ProductDTO | null> {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id }, { externalId: id }],
      isDeleted: false,
    },
  });

  if (!product) {
    return null;
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: {
      name: input.name ?? product.name,
      price: input.price ?? Number(product.price),
      imageUrl:
        input.imageUrl === undefined ? product.imageUrl : input.imageUrl,
      productUrl:
        input.productUrl === undefined ? product.productUrl : input.productUrl,
      storeName:
        input.storeName === undefined ? product.storeName : input.storeName,
      category:
        input.category === undefined ? product.category : input.category,
      isManual: true,
    },
  });

  return {
    id: updated.id,
    externalId: updated.externalId,
    name: updated.name,
    price: Number(updated.price),
    imageUrl: updated.imageUrl ?? undefined,
    productUrl: updated.productUrl ?? undefined,
    storeName: updated.storeName ?? undefined,
    category: updated.category ?? undefined,
  };
}

export async function deleteProduct(
  id: string,
): Promise<{ deleted: boolean } | null> {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id }, { externalId: id }],
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!product) {
    return null;
  }

  const [favoritesCount, alertsCount, historyCount] = await Promise.all([
    prisma.favorite.count({ where: { productId: product.id } }),
    prisma.priceAlert.count({ where: { productId: product.id } }),
    prisma.priceHistory.count({ where: { productId: product.id } }),
  ]);

  if (favoritesCount > 0 || alertsCount > 0 || historyCount > 0) {
    const summary = `favoritos=${favoritesCount}, alertas=${alertsCount}, historico=${historyCount}`;
    throw new ProductDeleteConflictError(summary);
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      isDeleted: true,
    },
  });

  return { deleted: true };
}
