import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RegisterPage } from "./RegisterPage";

const mockLoginWithToken = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ loginWithToken: mockLoginWithToken, user: null, loading: false, logout: vi.fn() }),
}));

vi.mock("../services/api", () => ({
  registerUser: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn(),
}));

import { registerUser } from "../services/api";

beforeEach(() => vi.clearAllMocks());

describe("RegisterPage", () => {
  function renderPage() {
    return render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
  }

  it("renders registration form", () => {
    renderPage();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar senha")).toBeInTheDocument();
  });

  it("submits registration", async () => {
    vi.mocked(registerUser).mockResolvedValue({ token: "t", user: { id: "u1", email: "a@b.com", role: "USER" } } as ReturnType<typeof registerUser> extends Promise<infer R> ? R : never);
    renderPage();

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "pass123" } });
    fireEvent.change(screen.getByLabelText("Confirmar senha"), { target: { value: "pass123" } });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
      expect(mockLoginWithToken).toHaveBeenCalled();
    });
  });

  it("shows error when passwords don't match", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "pass1" } });
    fireEvent.change(screen.getByLabelText("Confirmar senha"), { target: { value: "pass2" } });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(registerUser).not.toHaveBeenCalled();
    });
  });

  it("handles registration error", async () => {
    vi.mocked(registerUser).mockRejectedValue(new Error("Email exists"));
    renderPage();

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "pass" } });
    fireEvent.change(screen.getByLabelText("Confirmar senha"), { target: { value: "pass" } });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
    });
  });
});
