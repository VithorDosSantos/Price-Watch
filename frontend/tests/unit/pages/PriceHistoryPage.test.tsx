import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PriceHistoryPage } from "../../../src/pages/PriceHistoryPage";

vi.mock("../../../src/services/api", () => ({
  listPriceHistory: vi.fn(),
  createPriceHistory: vi.fn(),
  updatePriceHistory: vi.fn(),
  deletePriceHistory: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

import { listPriceHistory, createPriceHistory, deletePriceHistory } from "../../../src/services/api";

beforeEach(() => vi.clearAllMocks());

const mockHistory = [
  {
    id: "ph1",
    productName: "TV Samsung",
    oldPrice: 2500,
    newPrice: 2200,
    recordedAt: "2024-06-01T00:00:00Z"
  },
  {
    id: "ph2",
    productName: "iPhone 15",
    oldPrice: 5000,
    newPrice: 4500,
    recordedAt: "2024-06-02T00:00:00Z"
  }
];

describe("PriceHistoryPage", () => {
  it("renders heading and stats", async () => {
    vi.mocked(listPriceHistory).mockResolvedValue(mockHistory);
    render(
      <MemoryRouter>
        <PriceHistoryPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Histórico de Preços")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("TV Samsung")).toBeInTheDocument());
    expect(screen.getByText("Novo registro")).toBeInTheDocument();
  });

  it("filters by search", async () => {
    vi.mocked(listPriceHistory).mockResolvedValue(mockHistory);
    render(
      <MemoryRouter>
        <PriceHistoryPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText("TV Samsung")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Buscar produto..."), {
      target: { value: "iPhone" }
    });
    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(screen.queryByText("TV Samsung")).not.toBeInTheDocument();
  });

  it("opens create dialog and submits", async () => {
    vi.mocked(listPriceHistory).mockResolvedValue([]);
    vi.mocked(createPriceHistory).mockResolvedValue({
      id: "ph3",
      productName: "Test",
      oldPrice: 100,
      newPrice: 90,
      recordedAt: "2024-01-01"
    });
    render(
      <MemoryRouter>
        <PriceHistoryPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Novo registro"));
    await waitFor(() => expect(screen.getByLabelText("Produto")).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText("Produto"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText("Preço anterior"), { target: { value: "100" } });
    fireEvent.change(screen.getByLabelText("Novo preço"), { target: { value: "90" } });
    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => expect(createPriceHistory).toHaveBeenCalled());
  });

  it("deletes a record", async () => {
    vi.mocked(listPriceHistory).mockResolvedValue([mockHistory[0]]);
    vi.mocked(deletePriceHistory).mockResolvedValue(undefined as never);
    render(
      <MemoryRouter>
        <PriceHistoryPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText("TV Samsung")).toBeInTheDocument());

    const trashBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector(".text-red-600") !== null);
    if (trashBtn) fireEvent.click(trashBtn);

    await waitFor(() => expect(deletePriceHistory).toHaveBeenCalledWith("ph1"));
  });

  it("handles load error", async () => {
    vi.mocked(listPriceHistory).mockRejectedValue(new Error("fail"));
    render(
      <MemoryRouter>
        <PriceHistoryPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(listPriceHistory).toHaveBeenCalled());
  });
});
