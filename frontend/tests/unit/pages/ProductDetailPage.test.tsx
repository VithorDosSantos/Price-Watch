import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProductDetailPage } from "../../../src/pages/ProductDetailPage";

vi.mock("../../../src/services/api", () => ({
  getProduct: vi.fn(),
  listProductOffers: vi.fn().mockResolvedValue([]),
  listProductPriceHistory: vi.fn().mockResolvedValue([]),
  favoriteProduct: vi.fn(),
  deleteFavorite: vi.fn(),
  deleteProduct: vi.fn(),
  updateProduct: vi.fn(),
  listFavorites: vi.fn().mockResolvedValue([]),
  createAlert: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

vi.mock("../../../src/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "u1", email: "a@b.com", role: "ADMIN" },
    loading: false,
    logout: vi.fn(),
    loginWithToken: vi.fn()
  })
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />
}));

import { getProduct, favoriteProduct } from "../../../src/services/api";

beforeEach(() => vi.clearAllMocks());

const mockProduct = {
  id: "p1",
  name: "Test Product",
  price: 99.9,
  imageUrl: "https://example.com/img.jpg",
  productUrl: "https://example.com/product",
  storeName: "Amazon",
  category: "Eletrônicos",
  priceHistory: []
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/product/p1"]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProductDetailPage", () => {
  it("renders product details", async () => {
    vi.mocked(getProduct).mockResolvedValue(mockProduct);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
    expect(screen.getAllByText("Amazon").length).toBeGreaterThan(0);
  });

  it("shows loading state", () => {
    vi.mocked(getProduct).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/Carregando produto/i)).toBeInTheDocument();
  });

  it("shows not found when product is null", async () => {
    vi.mocked(getProduct).mockResolvedValue(null);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Produto não encontrado")).toBeInTheDocument();
    });
  });

  it("shows not found on error", async () => {
    vi.mocked(getProduct).mockRejectedValue(new Error("404"));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Produto não encontrado")).toBeInTheDocument();
    });
  });

  it("toggles favorite", async () => {
    vi.mocked(getProduct).mockResolvedValue(mockProduct);
    vi.mocked(favoriteProduct).mockResolvedValue({ id: "f1" });
    renderPage();

    await waitFor(() => expect(screen.getByText("Test Product")).toBeInTheDocument());

    const favBtn = screen.getByText(/Favoritar/i);
    if (favBtn) {
      fireEvent.click(favBtn);
      await waitFor(() => expect(favoriteProduct).toHaveBeenCalledWith("p1"));
    }
  });

  it("renders price history chart", async () => {
    vi.mocked(getProduct).mockResolvedValue(mockProduct);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
    expect(screen.getByText(/Histórico/i)).toBeInTheDocument();
  });
});
