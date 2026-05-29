import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";

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
  loginUser: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn(),
}));

import { loginUser } from "../services/api";

beforeEach(() => vi.clearAllMocks());

describe("LoginPage", () => {
  function renderPage() {
    return render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  }

  it("renders login form", () => {
    renderPage();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("submits login form", async () => {
    vi.mocked(loginUser).mockResolvedValue({ token: "t", user: { id: "u1", email: "a@b.com", role: "USER" } } as ReturnType<typeof loginUser> extends Promise<infer R> ? R : never);
    renderPage();

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "pass" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith("a@b.com", "pass");
      expect(mockLoginWithToken).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error on failed login", async () => {
    vi.mocked(loginUser).mockRejectedValue(new Error("Invalid credentials"));
    renderPage();

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalled();
    });
  });
});
