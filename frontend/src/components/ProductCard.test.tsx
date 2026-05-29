import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductCard } from "./ProductCard";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, loading: false, logout: vi.fn(), loginWithToken: vi.fn() })
}));

describe("ProductCard", () => {
  const props = {
    id: "p1",
    name: "Test Product",
    image: "https://example.com/img.jpg",
    currentPrice: 99.9,
    store: "Amazon"
  };

  it("renders product name", () => {
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("renders store name", () => {
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );
    expect(screen.getByText("Amazon")).toBeInTheDocument();
  });

  it("renders price", () => {
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );
    expect(screen.getByText(/99/)).toBeInTheDocument();
  });
});
