import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductCard } from "../../../src/components/ProductCard";
import { toast } from "sonner";

const mockNavigate = vi.fn();
let mockUser: { id: string; email: string; role: string } | null = {
  id: "u1",
  email: "a@b.com",
  role: "USER"
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../../src/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    logout: vi.fn(),
    loginWithToken: vi.fn()
  })
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("../../../src/services/api", () => ({
  createAlert: vi.fn(),
  deleteFavorite: vi.fn(),
  favoriteProduct: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn()
}));

import { createAlert, favoriteProduct, deleteFavorite } from "../../../src/services/api";

beforeEach(() => vi.clearAllMocks());
beforeEach(() => {
  mockUser = { id: "u1", email: "a@b.com", role: "USER" };
});

describe("ProductCard", () => {
  const props = {
    id: "p1",
    name: "Test Product",
    image: "https://example.com/img.jpg",
    currentPrice: 99.9,
    store: "Amazon"
  };

  it("renders product name and store", () => {
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );
    expect(screen.getByText("Test Product")).toBeInTheDocument();
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

  it("renders discount badge when originalPrice provided", () => {
    render(
      <MemoryRouter>
        <ProductCard {...props} originalPrice={120} />
      </MemoryRouter>
    );
    expect(screen.getByText(/-\d+%/)).toBeInTheDocument();
  });

  it("adds to favorites on click", async () => {
    vi.mocked(favoriteProduct).mockResolvedValue({ id: "f1" });
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText("Salvar nos favoritos"));
    await waitFor(() => expect(favoriteProduct).toHaveBeenCalledWith("p1"));
  });

  it("prevents duplicate favorite requests while saving", async () => {
    let resolveFavorite: ((value: unknown) => void) | undefined;
    vi.mocked(favoriteProduct).mockReturnValue(
      new Promise((resolve) => {
        resolveFavorite = resolve;
      }) as never
    );

    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );

    const favoriteButton = screen.getByLabelText("Salvar nos favoritos");
    fireEvent.click(favoriteButton);
    fireEvent.click(favoriteButton);
    fireEvent.click(favoriteButton);

    expect(favoriteProduct).toHaveBeenCalledTimes(1);

    resolveFavorite?.({ id: "f1" });
    await waitFor(() => expect(favoriteProduct).toHaveBeenCalledTimes(1));
  });

  it("redirects to login when user favorites without authentication", () => {
    mockUser = null;
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText("Salvar nos favoritos"));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(favoriteProduct).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it("opens favorites page when card is already favorite without favoriteId", () => {
    render(
      <MemoryRouter>
        <ProductCard {...props} isFavorite={true} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText("Ver favoritos"));

    expect(mockNavigate).toHaveBeenCalledWith("/favorites");
  });

  it("removes from favorites on click", async () => {
    vi.mocked(deleteFavorite).mockResolvedValue(undefined as never);
    const onRemoved = vi.fn();
    render(
      <MemoryRouter>
        <ProductCard {...props} isFavorite={true} favoriteId="f1" onFavoriteRemoved={onRemoved} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText("Ver favoritos"));
    await waitFor(() => expect(deleteFavorite).toHaveBeenCalledWith("f1"));
  });

  it("shows price change badge", () => {
    render(
      <MemoryRouter>
        <ProductCard {...props} priceChange={-5.2} />
      </MemoryRouter>
    );
    expect(screen.getByText(/5\.2/)).toBeInTheDocument();
  });

  it("creates alert from card with target price", async () => {
    vi.mocked(createAlert).mockResolvedValue({ id: "a1" } as never);
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Alerta"));
    await waitFor(() =>
      expect(screen.getByLabelText("Preco que voce quer pagar")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByLabelText("Preco que voce quer pagar"), {
      target: { value: "89.9" }
    });
    fireEvent.click(screen.getByText("Salvar alerta"));

    await waitFor(() => expect(createAlert).toHaveBeenCalledWith("p1", 89.9, "a@b.com"));
  });

  it("validates alert target price before calling API", async () => {
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Alerta"));
    await waitFor(() =>
      expect(screen.getByLabelText("Preco que voce quer pagar")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByLabelText("Preco que voce quer pagar"), {
      target: { value: "0" }
    });
    fireEvent.click(screen.getByText("Salvar alerta"));

    expect(createAlert).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it("shows error when alert creation fails", async () => {
    vi.mocked(createAlert).mockRejectedValue(new Error("erro"));
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Alerta"));
    await waitFor(() =>
      expect(screen.getByLabelText("Preco que voce quer pagar")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("Salvar alerta"));

    await waitFor(() => expect(createAlert).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });

  it("redirects to login when opening alert without authentication", () => {
    mockUser = null;
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Alerta"));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(toast.error).toHaveBeenCalled();
  });
});
