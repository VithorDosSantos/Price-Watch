import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertsPage } from "../../../src/pages/AlertsPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../../src/services/api", () => ({
  listAlerts: vi.fn(),
  createAlert: vi.fn(),
  searchProducts: vi.fn(),
  updateAlert: vi.fn(),
  deleteAlert: vi.fn(),
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

import { listAlerts, deleteAlert } from "../../../src/services/api";

beforeEach(() => vi.clearAllMocks());

const mockAlerts = [
  {
    id: "a1",
    isActive: true,
    targetPrice: 50,
    createdAt: "2024-01-01T00:00:00Z",
    product: { name: "Prod1", price: 100 }
  },
  {
    id: "a2",
    isActive: false,
    targetPrice: 200,
    createdAt: "2024-02-01T00:00:00Z",
    product: { name: "Prod2", price: 300 }
  }
];

describe("AlertsPage", () => {
  it("renders heading and stats", async () => {
    vi.mocked(listAlerts).mockResolvedValue(mockAlerts);
    render(
      <MemoryRouter>
        <AlertsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Alertas")).toBeInTheDocument();
    expect(screen.getByText("Novo alerta")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Total de alertas")).toBeInTheDocument());
  });

  it("renders alert list with product names", async () => {
    vi.mocked(listAlerts).mockResolvedValue(mockAlerts);
    render(
      <MemoryRouter>
        <AlertsPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getAllByText("Prod1").length).toBeGreaterThan(0);
    });
  });

  it("filters alerts by search", async () => {
    vi.mocked(listAlerts).mockResolvedValue(mockAlerts);
    render(
      <MemoryRouter>
        <AlertsPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getAllByText("Prod1").length).toBeGreaterThan(0));

    fireEvent.change(screen.getByPlaceholderText("Buscar por produto"), {
      target: { value: "Prod2" }
    });
    await waitFor(() => {
      expect(screen.queryByText("Prod1")).not.toBeInTheDocument();
    });
  });

  it("deletes an alert", async () => {
    vi.mocked(listAlerts).mockResolvedValue([mockAlerts[0]]);
    vi.mocked(deleteAlert).mockResolvedValue(undefined as never);
    render(
      <MemoryRouter>
        <AlertsPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getAllByText("Prod1").length).toBeGreaterThan(0));

    const trashBtns = screen
      .getAllByRole("button")
      .filter((btn) => btn.innerHTML.includes("lucide-trash"));
    if (trashBtns.length > 0) fireEvent.click(trashBtns[0]);

    await waitFor(() => expect(deleteAlert).toHaveBeenCalledWith("a1"));
  });

  it("handles empty alerts", async () => {
    vi.mocked(listAlerts).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <AlertsPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(listAlerts).toHaveBeenCalled());
    expect(screen.getByText(/Nenhum alerta encontrado/i)).toBeInTheDocument();
  });

  it("handles load error", async () => {
    vi.mocked(listAlerts).mockRejectedValue(new Error("fail"));
    render(
      <MemoryRouter>
        <AlertsPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(listAlerts).toHaveBeenCalled());
  });
});
