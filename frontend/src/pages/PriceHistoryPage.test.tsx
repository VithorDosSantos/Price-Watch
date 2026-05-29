import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PriceHistoryPage } from "./PriceHistoryPage";

vi.mock("../services/api", () => ({
  listPriceHistory: vi.fn(),
  createPriceHistory: vi.fn(),
  updatePriceHistory: vi.fn(),
  deletePriceHistory: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

import { listPriceHistory } from "../services/api";

beforeEach(() => vi.clearAllMocks());

describe("PriceHistoryPage", () => {
  it("renders heading", async () => {
    vi.mocked(listPriceHistory).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <PriceHistoryPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Histórico de Preços")).toBeInTheDocument();
  });

  it("renders price history list", async () => {
    vi.mocked(listPriceHistory).mockResolvedValue([
      {
        id: "ph1",
        productId: "p1",
        oldPrice: 99.9,
        newPrice: 89.9,
        recordedAt: "2024-01-01",
        productName: "Test"
      }
    ]);
    render(
      <MemoryRouter>
        <PriceHistoryPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(listPriceHistory).toHaveBeenCalled();
    });
  });
});
