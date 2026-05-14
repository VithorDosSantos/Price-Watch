export type Product = {
  id: string;
  externalId: string;
  name: string;
  price: number;
  imageUrl?: string;
  productUrl?: string;
  storeName?: string;
  category?: string;
};

export type Favorite = {
  id: string;
  userName: string;
  createdAt: string;
  product: Product;
};

export type PriceAlert = {
  id: string;
  targetPrice: number;
  email: string;
  isActive: boolean;
  createdAt: string;
  product: Product;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export const mockProducts: Product[] = [
  {
    id: "mock-notebook-acer",
    externalId: "MLB-MOCK-001",
    name: "Notebook Acer Aspire 5 Intel Core i5 8GB SSD 256GB",
    price: 2899.9,
    imageUrl: "https://http2.mlstatic.com/D_NQ_NP_2X_924372-MLA74651990001_022024-F.webp",
    productUrl: "https://www.mercadolivre.com.br/",
    storeName: "Mercado Livre",
    category: "Informática"
  },
  {
    id: "mock-smartphone-samsung",
    externalId: "MLB-MOCK-002",
    name: "Smartphone Samsung Galaxy 128GB Tela 6.6",
    price: 1499.99,
    imageUrl: "https://http2.mlstatic.com/D_NQ_NP_2X_943708-MLA75350427828_032024-F.webp",
    productUrl: "https://www.mercadolivre.com.br/",
    storeName: "Mercado Livre",
    category: "Celulares"
  },
  {
    id: "mock-fone-jbl",
    externalId: "MLB-MOCK-003",
    name: "Fone Bluetooth JBL Tune com Cancelamento de Ruído",
    price: 329.9,
    imageUrl: "https://http2.mlstatic.com/D_NQ_NP_2X_982149-MLU72757258761_112023-F.webp",
    productUrl: "https://www.mercadolivre.com.br/",
    storeName: "Mercado Livre",
    category: "Áudio"
  }
];

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    throw new Error("Falha na comunicação com a API.");
  }

  return response.json() as Promise<T>;
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const data = await request<{ products: Product[]; source: string }>(`/products/search?q=${encodeURIComponent(query)}`);
    return data.products;
  } catch {
    return mockProducts;
  }
}

export async function getProduct(id: string): Promise<Product | undefined> {
  try {
    return await request<Product>(`/products/${id}`);
  } catch {
    return mockProducts.find((product) => product.id === id || product.externalId === id);
  }
}

export async function favoriteProduct(productId: string) {
  return request<Favorite>("/favorites", {
    method: "POST",
    body: JSON.stringify({ productId, userName: "Aluno PriceWatch" })
  });
}

export async function listFavorites(): Promise<Favorite[]> {
  try {
    return await request<Favorite[]>("/favorites");
  } catch {
    return mockProducts.slice(0, 2).map((product, index) => ({
      id: `favorite-${index}`,
      userName: "Aluno PriceWatch",
      createdAt: new Date().toISOString(),
      product
    }));
  }
}

export async function createAlert(productId: string, targetPrice: number, email: string) {
  return request<PriceAlert>("/alerts", {
    method: "POST",
    body: JSON.stringify({ productId, targetPrice, email })
  });
}

export async function listAlerts(): Promise<PriceAlert[]> {
  try {
    return await request<PriceAlert[]>("/alerts");
  } catch {
    return [
      {
        id: "alert-mock-1",
        targetPrice: 2600,
        email: "aluno@pricewatch.com",
        isActive: true,
        createdAt: new Date().toISOString(),
        product: mockProducts[0]
      }
    ];
  }
}
