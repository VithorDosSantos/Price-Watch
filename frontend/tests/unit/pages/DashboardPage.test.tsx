import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "../../../src/pages/DashboardPage";

vi.mock("../../../src/services/api", () => ({
  listFavorites: vi.fn(),
  listPriceHistory: vi.fn(),
  mapProductToCard: vi.fn((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name,
    image: (p.imageUrl as string) ?? "https://example.com/img.jpg",
    currentPrice: p.price,
    store: (p.storeName as string) ?? "Loja"
  })),
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

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div />
}));

import React from "react";
import { listFavorites, listPriceHistory } from "../../../src/services/api";

beforeEach(() => vi.clearAllMocks());

describe("DashboardPage", () => {
  it("renders heading and stats", async () => {
    vi.mocked(listFavorites).mockResolvedValue([]);
    vi.mocked(listPriceHistory).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Painel")).toBeInTheDocument();
    });
    expect(screen.getByText("Itens acompanhados")).toBeInTheDocument();
    expect(screen.getByText("Alertas ativos")).toBeInTheDocument();
    expect(screen.getAllByText("Favoritos").length).toBeGreaterThan(0);
  });

  it("renders with data", async () => {
    vi.mocked(listFavorites).mockResolvedValue([
      { id: "f1", product: { id: "p1", name: "Notebook", price: 3000, storeName: "Amazon" } }
    ]);
    vi.mocked(listPriceHistory).mockResolvedValue([
      {
        id: "ph1",
        productName: "TV",
        newPrice: 2000,
        oldPrice: 2500,
        storeName: "ML",
        imageUrl: "https://example.com/tv.jpg",
        recordedAt: "2024-01-01"
      }
    ]);
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Notebook")).toBeInTheDocument();
    });
    expect(screen.getByText("TV")).toBeInTheDocument();
    expect(screen.getByText("Maiores quedas")).toBeInTheDocument();
  });

  it("handles load error", async () => {
    vi.mocked(listFavorites).mockRejectedValue(new Error("fail"));
    vi.mocked(listPriceHistory).mockRejectedValue(new Error("fail"));
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(listFavorites).toHaveBeenCalled());
  });
});
