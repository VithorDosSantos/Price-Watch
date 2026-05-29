import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

import { listCategories } from "../services/api";

beforeEach(() => vi.clearAllMocks());

describe("CategoriesPage", () => {
  it("renders heading", async () => {
    vi.mocked(listCategories).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Categorias")).toBeInTheDocument();
  });

  it("renders categories list", async () => {
    vi.mocked(listCategories).mockResolvedValue([
      { id: "c1", name: "Eletrônicos", description: "Desc", isActive: true }
    ]);
    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Eletrônicos")).toBeInTheDocument();
    });
  });
});
