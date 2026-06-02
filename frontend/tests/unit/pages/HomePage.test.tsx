import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "../../../src/pages/HomePage";

vi.mock("../../../src/services/api", () => ({
  searchProducts: vi.fn(),
  listFavorites: vi.fn().mockResolvedValue([]),
  mapProductToCard: vi.fn((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name,
    image: "",
    currentPrice: p.price ?? 0,
    store: (p.storeName as string) ?? ""
  })),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

vi.mock("../../../src/contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, loading: false, logout: vi.fn(), loginWithToken: vi.fn() })
}));

import { searchProducts } from "../../../src/services/api";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(searchProducts).mockResolvedValue({
    products: [],
    totalPages: 0,
    page: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });
});

describe("HomePage", () => {
  it("renders hero section", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/economize dinheiro/i)).toBeInTheDocument();
  });

  it("renders search input and button", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/nome do produto/i)).toBeInTheDocument();
    expect(screen.getByText("Pesquisar")).toBeInTheDocument();
  });

  it("shows feedback text", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Digite um produto/i)).toBeInTheDocument();
  });

  it("submits search and shows results", async () => {
    vi.mocked(searchProducts).mockResolvedValue({
      products: [{ id: "p1", name: "Notebook", price: 3000, storeName: "Amazon" }],
      totalPages: 1,
      page: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      totalResults: 1
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/nome do produto/i), {
      target: { value: "notebook" }
    });
    fireEvent.submit(screen.getByPlaceholderText(/nome do produto/i).closest("form")!);

    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalledWith("notebook", { page: 1, limit: 8 });
    });
    await waitFor(() => {
      expect(screen.getByText("Notebook")).toBeInTheDocument();
    });
  });

  it("shows empty message when no results", async () => {
    vi.mocked(searchProducts).mockResolvedValue({
      products: [],
      totalPages: 0,
      page: 1,
      hasNextPage: false,
      hasPreviousPage: false
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/nome do produto/i), {
      target: { value: "xyz" }
    });
    fireEvent.submit(screen.getByPlaceholderText(/nome do produto/i).closest("form")!);

    await waitFor(() => {
      expect(screen.getAllByText(/Nenhum produto encontrado/i).length).toBeGreaterThan(0);
    });
  });

  it("handles search error", async () => {
    vi.mocked(searchProducts).mockRejectedValue(new Error("fail"));

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/nome do produto/i), {
      target: { value: "test" }
    });
    fireEvent.submit(screen.getByPlaceholderText(/nome do produto/i).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/Não foi possível consultar/i)).toBeInTheDocument();
    });
  });
});
