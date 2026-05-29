import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertsPage } from "./AlertsPage";

vi.mock("../services/api", () => ({
  listAlerts: vi.fn(),
  createAlert: vi.fn(),
  updateAlert: vi.fn(),
  deleteAlert: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "u1", email: "a@b.com", role: "USER" }, loading: false, logout: vi.fn(), loginWithToken: vi.fn() }),
}));

import { listAlerts } from "../services/api";

beforeEach(() => vi.clearAllMocks());

describe("AlertsPage", () => {
  it("renders heading", async () => {
    vi.mocked(listAlerts).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <AlertsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Alertas")).toBeInTheDocument();
  });

  it("renders new alert button", async () => {
    vi.mocked(listAlerts).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <AlertsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Novo alerta")).toBeInTheDocument();
  });

  it("calls listAlerts on mount", async () => {
    vi.mocked(listAlerts).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <AlertsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(listAlerts).toHaveBeenCalled();
    });
  });
});
