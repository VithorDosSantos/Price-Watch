import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../src/App";

vi.mock("../../src/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: null,
    loading: false,
    logout: vi.fn(),
    loginWithToken: vi.fn()
  })
}));

vi.mock("../../src/services/api", () => ({
  searchProducts: vi.fn().mockResolvedValue({ products: [], totalPages: 0 }),
  listCategories: vi.fn().mockResolvedValue([]),
  listFavorites: vi.fn().mockResolvedValue([]),
  mapProductToCard: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

import React from "react";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getAllByText("PriceWatch").length).toBeGreaterThan(0);
  });

  it("renders footer", () => {
    render(<App />);
    expect(screen.getByText(/Todos os direitos reservados/)).toBeInTheDocument();
  });
});
