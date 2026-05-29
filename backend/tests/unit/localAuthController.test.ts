import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

vi.mock("../../src/services/authService", () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
}));

vi.mock("../../src/prisma/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed") },
}));

import {
  registerController,
  loginController,
  meController,
  updateMeController,
  deleteMeController,
} from "../../src/controllers/localAuthController";
import * as authSvc from "../../src/services/authService";
import { prisma } from "../../src/prisma/client";

function mockReqRes(body: any = {}, user?: { id: string }) {
  const req = { body } as any;
  if (user) req.user = user;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as any;
  return { req, res };
}

beforeEach(() => vi.clearAllMocks());

describe("registerController", () => {
  it("registers user", async () => {
    const result = { token: "t", user: { id: "u1" } };
    vi.mocked(authSvc.registerUser).mockResolvedValue(result as any);
    const { req, res } = mockReqRes({ email: "a@b.com", password: "pass" });
    await registerController(req, res);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it("returns 400 without email", async () => {
    const { req, res } = mockReqRes({ password: "pass" });
    await registerController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 on error", async () => {
    vi.mocked(authSvc.registerUser).mockRejectedValue(new Error("dup"));
    const { req, res } = mockReqRes({ email: "a@b.com", password: "pass" });
    await registerController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("loginController", () => {
  it("logs in", async () => {
    const result = { token: "t", user: { id: "u1" } };
    vi.mocked(authSvc.loginUser).mockResolvedValue(result as any);
    const { req, res } = mockReqRes({ email: "a@b.com", password: "pass" });
    await loginController(req, res);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it("returns 400 without credentials", async () => {
    const { req, res } = mockReqRes({});
    await loginController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 401 on bad credentials", async () => {
    vi.mocked(authSvc.loginUser).mockRejectedValue(new Error("bad"));
    const { req, res } = mockReqRes({ email: "a@b.com", password: "wrong" });
    await loginController(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("meController", () => {
  it("returns current user", async () => {
    const user = { id: "u1", email: "a@b.com", name: "N", role: "USER" };
    vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
    const { req, res } = mockReqRes({}, { id: "u1" });
    await meController(req, res);
    expect(res.json).toHaveBeenCalledWith({ user });
  });

  it("returns 401 without user", async () => {
    const { req, res } = mockReqRes();
    await meController(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 404 when user not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    const { req, res } = mockReqRes({}, { id: "u1" });
    await meController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("updateMeController", () => {
  it("updates name", async () => {
    const user = { id: "u1", email: "a@b.com", name: "New", role: "USER" };
    vi.mocked(prisma.user.update).mockResolvedValue(user as any);
    const { req, res } = mockReqRes({ name: "New" }, { id: "u1" });
    await updateMeController(req, res);
    expect(res.json).toHaveBeenCalledWith({ user });
  });

  it("updates password", async () => {
    const user = { id: "u1", email: "a@b.com", name: "N", role: "USER" };
    vi.mocked(prisma.user.update).mockResolvedValue(user as any);
    const { req, res } = mockReqRes({ password: "newpass" }, { id: "u1" });
    await updateMeController(req, res);
    expect(bcrypt.hash).toHaveBeenCalledWith("newpass", 10);
  });

  it("returns 400 without fields", async () => {
    const { req, res } = mockReqRes({}, { id: "u1" });
    await updateMeController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 401 without user", async () => {
    const { req, res } = mockReqRes({ name: "N" });
    await updateMeController(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("deleteMeController", () => {
  it("deletes account", async () => {
    vi.mocked(prisma.user.delete).mockResolvedValue({} as any);
    const { req, res } = mockReqRes({}, { id: "u1" });
    await deleteMeController(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("returns 401 without user", async () => {
    const { req, res } = mockReqRes();
    await deleteMeController(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
