import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

vi.mock("jsonwebtoken");

import { authenticate, requireAdmin } from "../../src/middleware/authMiddleware";

function mockReqResNext(headers: any = {}, user: any = undefined) {
  const req = { headers, user } as any;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();
  return { req, res, next };
}

beforeEach(() => vi.clearAllMocks());

describe("authenticate", () => {
  it("authenticates valid token", () => {
    vi.mocked(jwt.verify).mockReturnValue({ userId: "u1", role: "USER" } as any);
    const { req, res, next } = mockReqResNext({ authorization: "Bearer valid_token" });
    authenticate(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: "u1", role: "USER" });
  });

  it("returns 401 without Bearer prefix", () => {
    const { req, res, next } = mockReqResNext({ authorization: "invalid" });
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 without header", () => {
    const { req, res, next } = mockReqResNext({});
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 on invalid token", () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error("invalid");
    });
    const { req, res, next } = mockReqResNext({ authorization: "Bearer bad" });
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("requireAdmin", () => {
  it("allows admin", () => {
    const { req, res, next } = mockReqResNext({}, { id: "u1", role: "ADMIN" });
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 for non-admin", () => {
    const { req, res, next } = mockReqResNext({}, { id: "u1", role: "USER" });
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 401 without user", () => {
    const { req, res, next } = mockReqResNext({});
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
