import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "./HomePage";

vi.mock("../services/api", () => ({
  searchProducts: vi.fn().mockResolvedValue({ products: [], totalPages: 0 }),
  listFavorites: vi.fn().mockResolvedValue([]),
  mapProductToCard: vi.fn((p: any) => ({
    id: p.id,
    name: p.name,
    image: "",
    currentPrice: 0,
    store: "",
  })),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, loading: false, logout: vi.fn(), loginWithToken: vi.fn() }),
}));

beforeEach(() => vi.clearAllMocks());

describe("HomePage", () => {
  it("renders hero section", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/economize dinheiro/i)).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/nome do produto/i)).toBeInTheDocument();
  });
});
