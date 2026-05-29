import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import React from "react";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn()
}));

import { useAuth } from "../contexts/AuthContext";
const mockedUseAuth = vi.mocked(useAuth);

describe("AdminRoute", () => {
  it("renders nothing while loading", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: true,
      loginWithToken: vi.fn(),
      logout: vi.fn()
    });

    const { container } = render(
      <MemoryRouter>
        <AdminRoute>
          <span>Admin</span>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(container.innerHTML).toBe("");
  });

  it("redirects to /login when no user", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      loginWithToken: vi.fn(),
      logout: vi.fn()
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <span>Admin</span>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("redirects to / when user is not admin", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "1", email: "a@b.com", role: "USER" },
      loading: false,
      loginWithToken: vi.fn(),
      logout: vi.fn()
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <span>Admin</span>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("renders children when user is admin", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "1", email: "a@b.com", role: "ADMIN" },
      loading: false,
      loginWithToken: vi.fn(),
      logout: vi.fn()
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <span>Admin</span>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Admin")).toBeInTheDocument();
  });
});
