import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CategoriesPage } from "./CategoriesPage";

vi.mock("../services/api", () => ({
  listCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

import { listCategories, createCategory, deleteCategory } from "../services/api";

beforeEach(() => vi.clearAllMocks());

const mockCategories = [
  { id: "c1", name: "Eletrônicos", description: "Desc1", isActive: true },
  { id: "c2", name: "Alimentos", description: "Desc2", isActive: false }
];

describe("CategoriesPage", () => {
  it("renders heading and stats", async () => {
    vi.mocked(listCategories).mockResolvedValue(mockCategories);
    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Categorias")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Eletrônicos")).toBeInTheDocument());
    expect(screen.getByText("Total cadastradas")).toBeInTheDocument();
    expect(screen.getByText("Categorias ativas")).toBeInTheDocument();
  });

  it("filters categories by search", async () => {
    vi.mocked(listCategories).mockResolvedValue(mockCategories);
    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText("Eletrônicos")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Buscar categoria"), {
      target: { value: "Alim" }
    });
    expect(screen.getByText("Alimentos")).toBeInTheDocument();
    expect(screen.queryByText("Eletrônicos")).not.toBeInTheDocument();
  });

  it("opens create dialog and submits", async () => {
    vi.mocked(listCategories).mockResolvedValue([]);
    vi.mocked(createCategory).mockResolvedValue({
      id: "c3",
      name: "Nova",
      description: "Desc",
      isActive: true
    });
    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Nova categoria"));
    await waitFor(() => expect(screen.getByLabelText("Nome")).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Nova" } });
    fireEvent.change(screen.getByLabelText("Descrição"), { target: { value: "Desc" } });
    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => expect(createCategory).toHaveBeenCalled());
  });

  it("deletes a category", async () => {
    vi.mocked(listCategories).mockResolvedValue([mockCategories[0]]);
    vi.mocked(deleteCategory).mockResolvedValue(undefined as never);
    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText("Eletrônicos")).toBeInTheDocument());

    const trashBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector(".text-red-600") !== null);
    if (trashBtn) fireEvent.click(trashBtn);

    await waitFor(() => expect(deleteCategory).toHaveBeenCalledWith("c1"));
  });

  it("handles load error", async () => {
    vi.mocked(listCategories).mockRejectedValue(new Error("fail"));
    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(listCategories).toHaveBeenCalled());
  });
});
