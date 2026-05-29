import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesPage } from "./FavoritesPage";

vi.mock("../services/api", () => ({
  listFavorites: vi.fn(),
  mapProductToCard: vi.fn((p: any) => ({
    id: p.id,
    name: p.name,
    image: p.imageUrl ?? "",
    currentPrice: p.price,
    store: p.storeName ?? "",
  })),
  deleteFavorite: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "u1", email: "a@b.com", role: "USER" }, loading: false, logout: vi.fn(), loginWithToken: vi.fn() }),
}));

import { listFavorites } from "../services/api";

beforeEach(() => vi.clearAllMocks());

describe("FavoritesPage", () => {
  it("renders empty state when no favorites", async () => {
    vi.mocked(listFavorites).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/favoritos/i)).toBeInTheDocument();
    });
  });

  it("renders favorites heading", async () => {
    vi.mocked(listFavorites).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Favoritos")).toBeInTheDocument();
  });
});
