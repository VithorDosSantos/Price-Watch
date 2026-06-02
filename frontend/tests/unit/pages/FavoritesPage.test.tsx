import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesPage } from "../../../src/pages/FavoritesPage";

vi.mock("../../../src/services/api", () => ({
  listFavorites: vi.fn(),
  mapProductToCard: vi.fn((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name,
    image: (p.imageUrl as string) ?? "https://example.com/img.jpg",
    currentPrice: p.price,
    store: (p.storeName as string) ?? "Loja"
  })),
  deleteFavorite: vi.fn(),
  favoriteProduct: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

vi.mock("../../../src/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "u1", email: "a@b.com", role: "USER" },
    loading: false,
    logout: vi.fn(),
    loginWithToken: vi.fn()
  })
}));

import { listFavorites } from "../../../src/services/api";

beforeEach(() => vi.clearAllMocks());

describe("FavoritesPage", () => {
  it("renders empty state when no favorites", async () => {
    vi.mocked(listFavorites).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Favoritos")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/ainda não salvou/i)).toBeInTheDocument();
    });
    expect(screen.getByText("Buscar produtos")).toBeInTheDocument();
  });

  it("renders favorites with products", async () => {
    vi.mocked(listFavorites).mockResolvedValue([
      { id: "f1", product: { id: "p1", name: "Notebook", price: 3000, storeName: "Amazon" } },
      { id: "f2", product: { id: "p2", name: "Mouse", price: 150, storeName: "ML" } }
    ]);
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Notebook")).toBeInTheDocument();
      expect(screen.getByText("Mouse")).toBeInTheDocument();
    });
  });

  it("handles load error", async () => {
    vi.mocked(listFavorites).mockRejectedValue(new Error("fail"));
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(listFavorites).toHaveBeenCalled());
    expect(screen.getByText(/ainda não salvou/i)).toBeInTheDocument();
  });
});
