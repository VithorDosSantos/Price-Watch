import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProfilePage } from "./ProfilePage";

const mockLogout = vi.fn();
const mockLoginWithToken = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "u1", email: "a@b.com", name: "Test", role: "USER" },
    loading: false,
    logout: mockLogout,
    loginWithToken: mockLoginWithToken,
  }),
}));

vi.mock("../services/api", () => ({
  updateCurrentUser: vi.fn(),
  deleteCurrentUser: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn(),
}));

import { updateCurrentUser, deleteCurrentUser } from "../services/api";

beforeEach(() => vi.clearAllMocks());

describe("ProfilePage", () => {
  it("renders profile heading", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Meu perfil")).toBeInTheDocument();
  });

  it("submits profile update", async () => {
    vi.mocked(updateCurrentUser).mockResolvedValue({ user: { id: "u1", email: "a@b.com", name: "New", role: "USER" } });
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const nameInput = screen.getByDisplayValue("Test");
    fireEvent.change(nameInput, { target: { value: "New" } });
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(updateCurrentUser).toHaveBeenCalled();
    });
  });

  it("deletes account with confirmation", async () => {
    vi.spyOn(globalThis, "confirm").mockReturnValue(true);
    vi.mocked(deleteCurrentUser).mockResolvedValue(undefined as Awaited<ReturnType<typeof deleteCurrentUser>>);

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Excluir conta"));

    await waitFor(() => {
      expect(deleteCurrentUser).toHaveBeenCalled();
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
