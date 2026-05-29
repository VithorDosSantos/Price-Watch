import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProductDetailPage } from "./ProductDetailPage";

vi.mock("../services/api", () => ({
  getProduct: vi.fn(),
  addFavorite: vi.fn(),
  deleteFavorite: vi.fn(),
  listFavorites: vi.fn().mockResolvedValue([]),
  createAlert: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "u1", email: "a@b.com", role: "USER" }, loading: false, logout: vi.fn(), loginWithToken: vi.fn() }),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

import { getProduct } from "../services/api";

beforeEach(() => vi.clearAllMocks());

describe("ProductDetailPage", () => {
  it("renders product details", async () => {
    vi.mocked(getProduct).mockResolvedValue({
      id: "p1",
      name: "Test Product",
      price: 99.9,
      imageUrl: "https://example.com/img.jpg",
      url: "https://example.com/product",
      storeName: "Amazon",
      priceHistory: [],
    });

    render(
      <MemoryRouter initialEntries={["/product/p1"]}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
  });

  it("shows loading state", () => {
    vi.mocked(getProduct).mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/product/p1"]}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Carregando produto/i)).toBeInTheDocument();
  });
});
