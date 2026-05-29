import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import React from "react";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../contexts/AuthContext";
const mockedUseAuth = vi.mocked(useAuth);

describe("ProtectedRoute", () => {
  it("renders nothing while loading", () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: true, loginWithToken: vi.fn(), logout: vi.fn() });

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <span>Protected</span>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(container.innerHTML).toBe("");
  });

  it("redirects to /login when no user", () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false, loginWithToken: vi.fn(), logout: vi.fn() });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <span>Protected</span>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Protected")).not.toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "1", email: "a@b.com", role: "USER" },
      loading: false,
      loginWithToken: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <span>Protected</span>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected")).toBeInTheDocument();
  });
});
