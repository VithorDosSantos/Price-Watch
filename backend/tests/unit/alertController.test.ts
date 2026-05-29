import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/services/alertService", () => ({
  createPriceAlert: vi.fn(),
  listPriceAlerts: vi.fn(),
  updatePriceAlert: vi.fn(),
  deletePriceAlert: vi.fn(),
}));

import {
  createPriceAlertController,
  listPriceAlertsController,
  updatePriceAlertController,
  deletePriceAlertController,
} from "../../src/controllers/alertController";
import * as svc from "../../src/services/alertService";

function mockReqRes(body: any = {}, params: any = {}, user?: { id: string }) {
  const req = { body, params } as any;
  if (user) req.user = user;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as any;
  return { req, res };
}

beforeEach(() => vi.clearAllMocks());

describe("createPriceAlertController", () => {
  it("creates alert", async () => {
    const alert = { id: "a1" };
    vi.mocked(svc.createPriceAlert).mockResolvedValue(alert as any);
    const { req, res } = mockReqRes({ productId: "p1", targetPrice: 50, email: "a@b.com" }, {}, { id: "u1" });
    await createPriceAlertController(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("returns 401 without user", async () => {
    const { req, res } = mockReqRes();
    await createPriceAlertController(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 400 on error", async () => {
    vi.mocked(svc.createPriceAlert).mockRejectedValue(new Error("fail"));
    const { req, res } = mockReqRes({ productId: "p1", targetPrice: 50 }, {}, { id: "u1" });
    await createPriceAlertController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("listPriceAlertsController", () => {
  it("returns alerts", async () => {
    const alerts = [{ id: "a1" }];
    vi.mocked(svc.listPriceAlerts).mockResolvedValue(alerts as any);
    const { req, res } = mockReqRes({}, {}, { id: "u1" });
    await listPriceAlertsController(req, res);
    expect(res.json).toHaveBeenCalledWith(alerts);
  });

  it("returns 401 without user", async () => {
    const { req, res } = mockReqRes();
    await listPriceAlertsController(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("updatePriceAlertController", () => {
  it("updates alert", async () => {
    const updated = { id: "a1", targetPrice: 30 };
    vi.mocked(svc.updatePriceAlert).mockResolvedValue(updated as any);
    const { req, res } = mockReqRes({ targetPrice: 30 }, { id: "a1" }, { id: "u1" });
    await updatePriceAlertController(req, res);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.updatePriceAlert).mockResolvedValue(null);
    const { req, res } = mockReqRes({ targetPrice: 30 }, { id: "x" }, { id: "u1" });
    await updatePriceAlertController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 401 without user", async () => {
    const { req, res } = mockReqRes();
    await updatePriceAlertController(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 400 for invalid target price", async () => {
    const { req, res } = mockReqRes({ targetPrice: -5 }, { id: "a1" }, { id: "u1" });
    await updatePriceAlertController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 for empty email", async () => {
    const { req, res } = mockReqRes({ email: "  " }, { id: "a1" }, { id: "u1" });
    await updatePriceAlertController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("deletePriceAlertController", () => {
  it("deletes alert", async () => {
    vi.mocked(svc.deletePriceAlert).mockResolvedValue(true as any);
    const { req, res } = mockReqRes({}, { id: "a1" }, { id: "u1" });
    await deletePriceAlertController(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.deletePriceAlert).mockResolvedValue(null as any);
    const { req, res } = mockReqRes({}, { id: "x" }, { id: "u1" });
    await deletePriceAlertController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 401 without user", async () => {
    const { req, res } = mockReqRes();
    await deletePriceAlertController(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
