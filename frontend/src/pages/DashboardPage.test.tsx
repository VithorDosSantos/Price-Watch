import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";

vi.mock("../services/api", () => ({
  listFavorites: vi.fn().mockResolvedValue([]),
  listPriceHistory: vi.fn().mockResolvedValue([]),
  mapProductToCard: vi.fn((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name,
    image: "",
    currentPrice: 0,
    store: ""
  })),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "u1", email: "a@b.com", role: "USER" },
    loading: false,
    logout: vi.fn(),
    loginWithToken: vi.fn()
  })
}));

beforeEach(() => vi.clearAllMocks());

describe("DashboardPage", () => {
  it("renders dashboard heading", async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Painel")).toBeInTheDocument();
    });
  });

  it("renders stats cards", async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/produtos/i)).toBeInTheDocument();
    });
  });
});
