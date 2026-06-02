import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdminProductsPage } from "../../../src/pages/AdminProductsPage";

vi.mock("../../../src/services/api", () => ({
  getShowcaseProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

import { createProduct, deleteProduct, getShowcaseProducts } from "../../../src/services/api";

beforeEach(() => vi.clearAllMocks());

describe("AdminProductsPage", () => {
  it("renders heading and products", async () => {
    vi.mocked(getShowcaseProducts).mockResolvedValue({
      products: [
        {
          id: "p1",
          externalId: "p1",
          name: "Notebook",
          price: 3500,
          storeName: "Loja A"
        }
      ]
    } as never);

    render(
      <MemoryRouter>
        <AdminProductsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Produtos")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Notebook")).toBeInTheDocument());
  });

  it("opens create dialog and submits", async () => {
    vi.mocked(getShowcaseProducts).mockResolvedValue({ products: [] } as never);
    vi.mocked(createProduct).mockResolvedValue({
      id: "p1",
      externalId: "p1",
      name: "Produto Manual",
      price: 100
    } as never);

    render(
      <MemoryRouter>
        <AdminProductsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Novo produto" }));

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Produto Manual" }
    });
    fireEvent.change(screen.getByLabelText("Preco"), {
      target: { value: "100" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(createProduct).toHaveBeenCalled());
  });

  it("deletes product", async () => {
    vi.mocked(getShowcaseProducts).mockResolvedValue({
      products: [
        {
          id: "p1",
          externalId: "p1",
          name: "Notebook",
          price: 3500,
          storeName: "Loja A"
        }
      ]
    } as never);
    vi.mocked(deleteProduct).mockResolvedValue(undefined as never);

    render(
      <MemoryRouter>
        <AdminProductsPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Notebook")).toBeInTheDocument());
    const trashButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.innerHTML.includes("lucide-trash"));

    fireEvent.click(trashButtons[0]);

    await waitFor(() => expect(deleteProduct).toHaveBeenCalledWith("p1"));
  });
});
