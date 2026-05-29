import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StoresPage } from "./StoresPage";

vi.mock("../services/api", () => ({
  listStores: vi.fn(),
  createStore: vi.fn(),
  updateStore: vi.fn(),
  deleteStore: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn(),
}));

import { listStores } from "../services/api";

beforeEach(() => vi.clearAllMocks());

describe("StoresPage", () => {
  it("renders heading", async () => {
    vi.mocked(listStores).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <StoresPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Lojas")).toBeInTheDocument();
  });

  it("renders stores list", async () => {
    vi.mocked(listStores).mockResolvedValue([
      { id: "s1", name: "Amazon", url: "https://amazon.com", isActive: true },
    ]);
    render(
      <MemoryRouter>
        <StoresPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Amazon")).toBeInTheDocument();
    });
  });
});
