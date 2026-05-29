import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StoresPage } from "./StoresPage";

vi.mock("../services/api", () => ({
  listStores: vi.fn(),
  createStore: vi.fn(),
  updateStore: vi.fn(),
  deleteStore: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

import { listStores, createStore, deleteStore } from "../services/api";

beforeEach(() => vi.clearAllMocks());

const mockStores = [
  {
    id: "s1",
    name: "Amazon",
    website: "https://amazon.com",
    contactEmail: "a@a.com",
    isActive: true
  },
  {
    id: "s2",
    name: "Mercado Livre",
    website: "https://ml.com",
    contactEmail: "b@b.com",
    isActive: false
  }
];

describe("StoresPage", () => {
  it("renders heading and stats", async () => {
    vi.mocked(listStores).mockResolvedValue(mockStores);
    render(
      <MemoryRouter>
        <StoresPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Lojas")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Amazon")).toBeInTheDocument());
    expect(screen.getByText("Total cadastradas")).toBeInTheDocument();
    expect(screen.getByText("Lojas ativas")).toBeInTheDocument();
  });

  it("filters stores by search", async () => {
    vi.mocked(listStores).mockResolvedValue(mockStores);
    render(
      <MemoryRouter>
        <StoresPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText("Amazon")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Buscar loja"), {
      target: { value: "Mercado" }
    });
    expect(screen.getByText("Mercado Livre")).toBeInTheDocument();
    expect(screen.queryByText("Amazon")).not.toBeInTheDocument();
  });

  it("opens create dialog and submits", async () => {
    vi.mocked(listStores).mockResolvedValue([]);
    vi.mocked(createStore).mockResolvedValue({
      id: "s3",
      name: "Nova",
      website: "https://nova.com",
      contactEmail: "c@c.com",
      isActive: true
    });
    render(
      <MemoryRouter>
        <StoresPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Nova loja"));
    await waitFor(() => expect(screen.getByLabelText("Nome")).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Nova" } });
    fireEvent.change(screen.getByLabelText("Website"), { target: { value: "https://nova.com" } });
    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => expect(createStore).toHaveBeenCalled());
  });

  it("deletes a store", async () => {
    vi.mocked(listStores).mockResolvedValue([mockStores[0]]);
    vi.mocked(deleteStore).mockResolvedValue(undefined as never);
    render(
      <MemoryRouter>
        <StoresPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText("Amazon")).toBeInTheDocument());

    const trashBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector(".text-red-600") !== null);
    if (trashBtn) fireEvent.click(trashBtn);

    await waitFor(() => expect(deleteStore).toHaveBeenCalledWith("s1"));
  });

  it("handles load error", async () => {
    vi.mocked(listStores).mockRejectedValue(new Error("fail"));
    render(
      <MemoryRouter>
        <StoresPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(listStores).toHaveBeenCalled());
  });
});
