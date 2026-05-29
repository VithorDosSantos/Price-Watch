import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/prisma/client", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { listUsers, updateUserRole } from "../../src/controllers/userController";
import { prisma } from "../../src/prisma/client";

function mockReqRes(body: any = {}, params: any = {}) {
  const req = { body, params } as any;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  return { req, res };
}

beforeEach(() => vi.clearAllMocks());

describe("listUsers", () => {
  it("returns users", async () => {
    const users = [{ id: "u1", email: "a@b.com" }];
    vi.mocked(prisma.user.findMany).mockResolvedValue(users as any);
    const { req, res } = mockReqRes();
    await listUsers(req, res);
    expect(res.json).toHaveBeenCalledWith({ users });
  });
});

describe("updateUserRole", () => {
  it("updates role to ADMIN", async () => {
    const user = { id: "u1", email: "a@b.com", role: "ADMIN" };
    vi.mocked(prisma.user.update).mockResolvedValue(user as any);
    const { req, res } = mockReqRes({ role: "ADMIN" }, { id: "u1" });
    await updateUserRole(req, res);
    expect(res.json).toHaveBeenCalledWith({ user });
  });

  it("returns 400 for invalid role", async () => {
    const { req, res } = mockReqRes({ role: "INVALID" }, { id: "u1" });
    await updateUserRole(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 without role", async () => {
    const { req, res } = mockReqRes({}, { id: "u1" });
    await updateUserRole(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 500 on error", async () => {
    vi.mocked(prisma.user.update).mockRejectedValue(new Error("fail"));
    const { req, res } = mockReqRes({ role: "USER" }, { id: "u1" });
    await updateUserRole(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
