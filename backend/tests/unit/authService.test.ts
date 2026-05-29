import { afterEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/prisma/client";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn().mockReturnValue("mock-jwt-token"),
  },
}));

import bcrypt from "bcryptjs";
import { registerUser, loginUser } from "../../src/services/authService";

const mockedBcrypt = vi.mocked(bcrypt);

const originalUser = prisma.user;

afterEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(prisma, "user", {
    value: originalUser,
    configurable: true,
  });
});

describe("authService", () => {
  describe("registerUser", () => {
    it("throws when email is already in use", async () => {
      Object.defineProperty(prisma, "user", {
        value: {
          findUnique: vi.fn().mockResolvedValueOnce({ id: "existing" }),
        },
        configurable: true,
      });

      await expect(
        registerUser({ email: "a@b.com", password: "123456" }),
      ).rejects.toThrow("Email already in use");
    });

    it("makes the first user an ADMIN", async () => {
      Object.defineProperty(prisma, "user", {
        value: {
          findUnique: vi.fn().mockResolvedValueOnce(null),
          count: vi.fn().mockResolvedValueOnce(0),
          create: vi.fn().mockResolvedValueOnce({
            id: "u1",
            email: "first@admin.com",
            name: "Admin",
            role: "ADMIN",
            password: "hashed_password",
          }),
        },
        configurable: true,
      });

      const result = await registerUser({
        name: "Admin",
        email: "first@admin.com",
        password: "123456",
      });

      expect(result.isFirstAdmin).toBe(true);
      expect(result.user.role).toBe("ADMIN");
      expect(result.token).toBe("mock-jwt-token");
    });

    it("makes subsequent users USER role", async () => {
      Object.defineProperty(prisma, "user", {
        value: {
          findUnique: vi.fn().mockResolvedValueOnce(null),
          count: vi.fn().mockResolvedValueOnce(5),
          create: vi.fn().mockResolvedValueOnce({
            id: "u2",
            email: "user@test.com",
            name: "User",
            role: "USER",
            password: "hashed_password",
          }),
        },
        configurable: true,
      });

      const result = await registerUser({
        email: "user@test.com",
        password: "123456",
      });

      expect(result.isFirstAdmin).toBe(false);
      expect(result.user.role).toBe("USER");
    });

    it("hashes the password before storing", async () => {
      Object.defineProperty(prisma, "user", {
        value: {
          findUnique: vi.fn().mockResolvedValueOnce(null),
          count: vi.fn().mockResolvedValueOnce(1),
          create: vi.fn().mockResolvedValueOnce({
            id: "u3",
            email: "x@y.com",
            name: null,
            role: "USER",
            password: "hashed_password",
          }),
        },
        configurable: true,
      });

      await registerUser({ email: "x@y.com", password: "mypass" });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith("mypass", 10);
    });
  });

  describe("loginUser", () => {
    it("throws when user not found", async () => {
      Object.defineProperty(prisma, "user", {
        value: {
          findUnique: vi.fn().mockResolvedValueOnce(null),
        },
        configurable: true,
      });

      await expect(loginUser("no@one.com", "pass")).rejects.toThrow("Invalid credentials");
    });

    it("throws when password is wrong", async () => {
      Object.defineProperty(prisma, "user", {
        value: {
          findUnique: vi.fn().mockResolvedValueOnce({
            id: "u1",
            email: "a@b.com",
            password: "hashed",
            role: "USER",
          }),
        },
        configurable: true,
      });

      mockedBcrypt.compare.mockResolvedValueOnce(false as never);

      await expect(loginUser("a@b.com", "wrong")).rejects.toThrow("Invalid credentials");
    });

    it("returns token and user on successful login", async () => {
      Object.defineProperty(prisma, "user", {
        value: {
          findUnique: vi.fn().mockResolvedValueOnce({
            id: "u1",
            email: "a@b.com",
            name: "User",
            password: "hashed",
            role: "USER",
          }),
        },
        configurable: true,
      });

      mockedBcrypt.compare.mockResolvedValueOnce(true as never);

      const result = await loginUser("a@b.com", "correctpass");

      expect(result.token).toBe("mock-jwt-token");
      expect(result.user.email).toBe("a@b.com");
      expect(result.user.id).toBe("u1");
    });
  });
});
