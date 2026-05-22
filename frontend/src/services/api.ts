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

export type ProductSearchResponse = {
  products: Product[];
  source: "mercado-livre" | "mock";
  message?: string;
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

export type StoreRecord = {
  id: string;
  name: string;
  website: string;
  contactEmail: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoreInput = {
  name: string;
  website: string;
  contactEmail: string;
  isActive?: boolean;
};

export type CategoryRecord = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryInput = {
  name: string;
  description: string;
  isActive?: boolean;
};

export type PriceHistoryRecord = {
  id: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  capturedAt: string;
};

export type PriceHistoryInput = {
  productName: string;
  oldPrice: number;
  newPrice: number;
  capturedAt?: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

// No client-side mock data: always use real backend responses

let authToken: string | null = localStorage.getItem("pw_token");

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) localStorage.setItem("pw_token", token);
  else localStorage.removeItem("pw_token");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const response = await fetch(`${API_URL}${path}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    throw new Error("Falha na comunicação com a API.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// Auth helpers
export async function registerUser(name: string | undefined, email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string; name?: string; role: string } }>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    }
  );
}

export async function loginUser(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string; name?: string; role: string } }>(
    "/auth/login/local",
    {
      method: "POST",
      body: JSON.stringify({ email, password })
    }
  );
}

export async function getCurrentUser() {
  return request<{ user: { id: string; email: string; name?: string; role: string } }>("/auth/me");
}

// Admin user management
export async function getUsers() {
  return request<{ users: Array<{ id: string; email: string; name?: string; role: string; createdAt: string }> }>("/users");
}

export async function updateUserRole(userId: string, role: "ADMIN" | "USER") {
  return request<{ user: { id: string; email: string; name?: string; role: string } }>(`/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role })
  });
}

export async function searchProducts(query: string): Promise<ProductSearchResponse> {
  return await request<ProductSearchResponse>(`/products/search?q=${encodeURIComponent(query)}`);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return await request<Product>(`/products/${id}`);
}

export async function favoriteProduct(productId: string) {
  return request<Favorite>("/favorites", {
    method: "POST",
    body: JSON.stringify({ productId, userName: "Aluno PriceWatch" })
  });
}

export async function listFavorites(): Promise<Favorite[]> {
  return await request<Favorite[]>("/favorites");
}

export async function createAlert(productId: string, targetPrice: number, email: string) {
  return request<PriceAlert>("/alerts", {
    method: "POST",
    body: JSON.stringify({ productId, targetPrice, email })
  });
}

export async function listAlerts(): Promise<PriceAlert[]> {
  return await request<PriceAlert[]>("/alerts");
}

export async function listStores(): Promise<StoreRecord[]> {
  return await request<StoreRecord[]>("/stores");
}

export async function createStore(input: StoreInput) {
  return request<StoreRecord>("/stores", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateStore(id: string, input: Partial<StoreInput>) {
  return request<StoreRecord>(`/stores/${id}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}

export async function deleteStore(id: string) {
  return request<void>(`/stores/${id}`, {
    method: "DELETE"
  });
}

export async function listCategories(): Promise<CategoryRecord[]> {
  return await request<CategoryRecord[]>("/categories");
}

export async function createCategory(input: CategoryInput) {
  return request<CategoryRecord>("/categories", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  return request<CategoryRecord>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}

export async function deleteCategory(id: string) {
  return request<void>(`/categories/${id}`, {
    method: "DELETE"
  });
}

export async function listPriceHistory(): Promise<PriceHistoryRecord[]> {
  return await request<PriceHistoryRecord[]>("/price-history");
}

export async function createPriceHistory(input: PriceHistoryInput) {
  return request<PriceHistoryRecord>("/price-history", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updatePriceHistory(id: string, input: Partial<PriceHistoryInput>) {
  return request<PriceHistoryRecord>(`/price-history/${id}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}

export async function deletePriceHistory(id: string) {
  return request<void>(`/price-history/${id}`, {
    method: "DELETE"
  });
}
