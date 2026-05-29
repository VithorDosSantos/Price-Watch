import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdminUsersPage } from "./AdminUsersPage";

vi.mock("../services/api", () => ({
  getUsers: vi.fn(),
  updateUserRole: vi.fn(),
  setAuthToken: vi.fn(),
  getCurrentUser: vi.fn(),
}));

import { getUsers, updateUserRole } from "../services/api";

beforeEach(() => vi.clearAllMocks());

describe("AdminUsersPage", () => {
  it("renders users table", async () => {
    vi.mocked(getUsers).mockResolvedValue({
      users: [
        { id: "1", email: "a@b.com", name: "Alice", role: "USER" },
        { id: "2", email: "c@d.com", name: "Bob", role: "ADMIN" },
      ],
    });

    render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("a@b.com")).toBeInTheDocument();
      expect(screen.getByText("c@d.com")).toBeInTheDocument();
    });
  });

  it("promotes user to admin", async () => {
    vi.mocked(getUsers).mockResolvedValue({
      users: [{ id: "1", email: "a@b.com", name: "Alice", role: "USER" }],
    });
    vi.mocked(updateUserRole).mockResolvedValue({
      user: { id: "1", email: "a@b.com", name: "Alice", role: "ADMIN" },
    });

    render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Tornar admin")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Tornar admin"));

    await waitFor(() => {
      expect(updateUserRole).toHaveBeenCalledWith("1", "ADMIN");
    });
  });

  it("handles load error", async () => {
    vi.mocked(getUsers).mockRejectedValue(new Error("fail"));

    render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getUsers).toHaveBeenCalled();
    });
  });
});
