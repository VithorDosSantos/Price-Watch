import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "../../../src/components/Navbar";

const mockLogout = vi.fn();

vi.mock("../../../src/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "u1", email: "a@b.com", role: "ADMIN", name: "Test" },
    loading: false,
    logout: mockLogout,
    loginWithToken: vi.fn()
  })
}));

describe("Navbar", () => {
  it("renders brand", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText("PriceWatch")).toBeInTheDocument();
  });

  it("renders alert link", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("Ir para alertas")).toBeInTheDocument();
  });

  it("renders admin link for admin users", () => {
    localStorage.setItem("pw_token", "test-token");
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText("Admin")).toBeInTheDocument();
    localStorage.removeItem("pw_token");
  });

  it("renders profile link when authenticated", () => {
    localStorage.setItem("pw_token", "test-token");
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("Meu perfil")).toBeInTheDocument();
    localStorage.removeItem("pw_token");
  });

  it("renders logout button", () => {
    localStorage.setItem("pw_token", "test-token");
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    const logoutBtn = screen.getByText("Sair");
    expect(logoutBtn).toBeInTheDocument();
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
    localStorage.removeItem("pw_token");
  });

  it("renders search input on non-home pages", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText("Buscar produtos...")).toBeInTheDocument();
  });
});
