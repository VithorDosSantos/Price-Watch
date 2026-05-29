import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./Navbar";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, loading: false, logout: vi.fn(), loginWithToken: vi.fn() }),
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

  it("renders login link when not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText("Entrar")).toBeInTheDocument();
  });

  it("renders alert link", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("Ir para alertas")).toBeInTheDocument();
  });
});
