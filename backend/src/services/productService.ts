import { prisma } from "../prisma/client";
import { getValidMercadoLivreAccessToken } from "./mercadoLivreAuthService";

type MercadoLivreItem = {
  id: string;
  title: string;
  price: number;
  thumbnail?: string;
  permalink?: string;
  seller?: {
    nickname?: string;
  };
  category_id?: string;
};

type MercadoLivreSearchResponse = {
  results: MercadoLivreItem[];
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

export class MercadoLivreError extends Error {
  constructor(public status: number, public body: string) {
    super(`MercadoLivreError ${status}`);
    this.name = "MercadoLivreError";
  }
}

const mercadoLivreApiUrl = process.env.MERCADO_LIVRE_API_URL ?? "https://api.mercadolibre.com";

async function fetchMercadoLivreSearch(query: string, useAuth: boolean): Promise<Response> {
  const url = `${mercadoLivreApiUrl}/sites/MLB/search?q=${encodeURIComponent(query)}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "User-Agent": "PriceWatch/1.0 (+https://price-watch-0uez.onrender.com)"
  };

  if (useAuth) {
    const token = await getValidMercadoLivreAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, { headers });
}

function mapMercadoLivreItem(item: MercadoLivreItem): ProductDTO {
  return {
    id: item.id,
    externalId: item.id,
    name: item.title,
    price: item.price,
    imageUrl: item.thumbnail?.replace("-I.", "-O."),
    productUrl: item.permalink,
    storeName: item.seller?.nickname ?? "Mercado Livre",
    category: item.category_id
  };
}

async function searchMercadoLivre(query: string): Promise<ProductDTO[]> {
  const authedResponse = await fetchMercadoLivreSearch(query, true);

  if (authedResponse.ok) {
    const authedData = (await authedResponse.json()) as MercadoLivreSearchResponse;
    return authedData.results.map(mapMercadoLivreItem);
  }


  // Log response body for diagnosis when authenticated call fails
  try {
    const text = await authedResponse.text();
    console.error("MercadoLivre authed search failed", { status: authedResponse.status, body: text });
  } catch (e) {
    console.error("MercadoLivre authed search failed and body could not be read", e);
  }

  if (authedResponse.status === 403) {
    const publicResponse = await fetchMercadoLivreSearch(query, false);

    if (publicResponse.ok) {
      const publicData = (await publicResponse.json()) as MercadoLivreSearchResponse;
      return publicData.results.map(mapMercadoLivreItem);
    }

    const details = await publicResponse.text();
    console.error("MercadoLivre public search also failed", { status: publicResponse.status, body: details });
    throw new MercadoLivreError(publicResponse.status, details || `Mercado Livre API returned ${publicResponse.status}`);
  }

  const details = await authedResponse.text();
  throw new MercadoLivreError(authedResponse.status, details || `Mercado Livre API returned ${authedResponse.status}`);
}

type ProductSearchResult = {
  source: "mercado-livre" | "mock";
  products: ProductDTO[];
  message?: string;
};

export async function searchProducts(query: string): Promise<ProductSearchResult> {
  if (!query.trim()) {
    return { source: "mercado-livre", products: [] };
  }

  const products = await searchMercadoLivre(query);
  return { source: "mercado-livre", products };
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

  const buildHeaders = async (useAuth: boolean) => {
    const headers: Record<string, string> = { Accept: "application/json" };

    if (useAuth) {
      const token = await getValidMercadoLivreAccessToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  const authedResponse = await fetch(`${mercadoLivreApiUrl}/items/${encodeURIComponent(id)}`, {
    headers: await buildHeaders(true)
  });

  if (authedResponse.ok) {
    const item = (await authedResponse.json()) as MercadoLivreItem;
    return mapMercadoLivreItem(item);
  }

  try {
    const text = await authedResponse.text();
    console.error("MercadoLivre authed item fetch failed", { status: authedResponse.status, body: text });
  } catch (e) {
    console.error("MercadoLivre authed item fetch failed and body could not be read", e);
  }

  if (authedResponse.status === 403) {
    const publicResponse = await fetch(`${mercadoLivreApiUrl}/items/${encodeURIComponent(id)}`, {
      headers: await buildHeaders(false)
    });

    if (!publicResponse.ok) {
      try {
        const details = await publicResponse.text();
        console.error("MercadoLivre public item fetch also failed", { status: publicResponse.status, body: details });
        throw new MercadoLivreError(publicResponse.status, details || `Mercado Livre API returned ${publicResponse.status}`);
      } catch (e) {
        console.error("MercadoLivre public item fetch also failed and body could not be read", e);
        throw new MercadoLivreError(publicResponse.status, "unreadable body");
      }
    }

    const item = (await publicResponse.json()) as MercadoLivreItem;
    return mapMercadoLivreItem(item);
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
