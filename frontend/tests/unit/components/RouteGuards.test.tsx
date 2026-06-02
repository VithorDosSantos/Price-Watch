import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ProtectedRoute } from "../../../src/components/ProtectedRoute";
import { AdminRoute } from "../../../src/components/AdminRoute";
import React from "react";

vi.mock("../../../src/contexts/AuthContext", () => ({
  useAuth: vi.fn()
}));

import { useAuth } from "../../../src/contexts/AuthContext";
const mockedUseAuth = vi.mocked(useAuth);

function mockAuth(overrides: Partial<ReturnType<typeof useAuth>> = {}) {
  mockedUseAuth.mockReturnValue({
    user: null,
    loading: false,
    loginWithToken: vi.fn(),
    logout: vi.fn(),
    ...overrides
  });
}

describe("ProtectedRoute", () => {
  it("renders nothing while loading", () => {
    mockAuth({ loading: true });
    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <span>Content</span>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe("");
  });

  it("redirects when no user", () => {
    mockAuth();
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <span>Content</span>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    mockAuth({ user: { id: "1", email: "a@b.com", role: "USER" } });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <span>Content</span>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("AdminRoute", () => {
  it("renders nothing while loading", () => {
    mockAuth({ loading: true });
    const { container } = render(
      <MemoryRouter>
        <AdminRoute>
          <span>Admin</span>
        </AdminRoute>
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe("");
  });

  it("redirects when no user", () => {
    mockAuth();
    render(
      <MemoryRouter>
        <AdminRoute>
          <span>Admin</span>
        </AdminRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("redirects when user is not admin", () => {
    mockAuth({ user: { id: "1", email: "a@b.com", role: "USER" } });
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
    mockAuth({ user: { id: "1", email: "a@b.com", role: "ADMIN" } });
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
