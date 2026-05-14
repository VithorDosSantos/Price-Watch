import { prisma } from "../prisma/client";
import { mockProducts } from "./mockData";

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

const mercadoLivreApiUrl = process.env.MERCADO_LIVRE_API_URL ?? "https://api.mercadolibre.com";

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
  const url = `${mercadoLivreApiUrl}/sites/MLB/search?q=${encodeURIComponent(query)}&limit=12`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Mercado Livre API returned ${response.status}`);
  }

  const data = (await response.json()) as MercadoLivreSearchResponse;
  return data.results.map(mapMercadoLivreItem);
}

export async function searchProducts(query: string): Promise<{ source: "mercado-livre" | "mock"; products: ProductDTO[] }> {
  if (!query.trim()) {
    return { source: "mock", products: mockProducts };
  }

  try {
    const products = await searchMercadoLivre(query);
    return { source: "mercado-livre", products: products.length > 0 ? products : mockProducts };
  } catch {
    return { source: "mock", products: mockProducts };
  }
}

export async function getProductById(id: string): Promise<ProductDTO | null> {
  const mockProduct = mockProducts.find((product) => product.id === id || product.externalId === id);
  if (mockProduct) {
    return mockProduct;
  }

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

  try {
    const response = await fetch(`${mercadoLivreApiUrl}/items/${encodeURIComponent(id)}`);
    if (!response.ok) {
      return null;
    }

    const item = (await response.json()) as MercadoLivreItem;
    return mapMercadoLivreItem(item);
  } catch {
    return null;
  }
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
