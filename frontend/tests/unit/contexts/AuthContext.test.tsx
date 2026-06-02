import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../../../src/contexts/AuthContext";
import React from "react";

vi.mock("../../../src/services/api", () => ({
  getCurrentUser: vi.fn(),
  setAuthToken: vi.fn()
}));

import { getCurrentUser, setAuthToken } from "../../../src/services/api";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedSetAuthToken = vi.mocked(setAuthToken);

function TestConsumer() {
  const { user, loading, loginWithToken, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.email : "null"}</span>
      <button onClick={() => loginWithToken("tok", { id: "1", email: "a@b.com", role: "USER" })}>
        login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("AuthContext", () => {
  it("starts in loading state and resolves to null user when no token", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("loads user from API when token exists in localStorage", async () => {
    localStorage.setItem("pw_token", "valid-token");
    mockedGetCurrentUser.mockResolvedValueOnce({
      user: { id: "u1", email: "test@test.com", role: "USER" }
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("user").textContent).toBe("test@test.com");
    expect(mockedSetAuthToken).toHaveBeenCalledWith("valid-token");
  });

  it("clears user when API fails", async () => {
    localStorage.setItem("pw_token", "bad-token");
    mockedGetCurrentUser.mockRejectedValueOnce(new Error("Unauthorized"));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(mockedSetAuthToken).toHaveBeenCalledWith(null);
  });

  it("loginWithToken sets the user", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    screen.getByText("login").click();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("a@b.com");
    });
    expect(mockedSetAuthToken).toHaveBeenCalledWith("tok");
  });

  it("logout clears the user", async () => {
    localStorage.setItem("pw_token", "valid-token");
    mockedGetCurrentUser.mockResolvedValueOnce({
      user: { id: "u1", email: "test@test.com", role: "USER" }
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("test@test.com");
    });

    screen.getByText("logout").click();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("null");
    });
    expect(mockedSetAuthToken).toHaveBeenCalledWith(null);
  });
});
