import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/services/priceHistoryService", () => ({
  listPriceHistoryRecords: vi.fn(),
  createPriceHistoryRecord: vi.fn(),
  updatePriceHistoryRecord: vi.fn(),
  deletePriceHistoryRecord: vi.fn(),
}));

import {
  listPriceHistoryController,
  createPriceHistoryController,
  updatePriceHistoryController,
  deletePriceHistoryController,
} from "../../src/controllers/priceHistoryController";
import * as svc from "../../src/services/priceHistoryService";

function mockReqRes(body: any = {}, params: any = {}) {
  const req = { body, params } as any;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as any;
  return { req, res };
}

beforeEach(() => vi.clearAllMocks());

describe("listPriceHistoryController", () => {
  it("returns history records", async () => {
    const records = [{ id: "1", productName: "P" }];
    vi.mocked(svc.listPriceHistoryRecords).mockResolvedValue(records as any);
    const { req, res } = mockReqRes();
    await listPriceHistoryController(req, res);
    expect(res.json).toHaveBeenCalledWith(records);
  });
});

describe("createPriceHistoryController", () => {
  it("creates record successfully", async () => {
    const record = { id: "1", productName: "P" };
    vi.mocked(svc.createPriceHistoryRecord).mockResolvedValue(record as any);
    const { req, res } = mockReqRes({ productName: "P", oldPrice: 10, newPrice: 8 });
    await createPriceHistoryController(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(record);
  });

  it("returns 400 on error", async () => {
    vi.mocked(svc.createPriceHistoryRecord).mockRejectedValue(new Error("fail"));
    const { req, res } = mockReqRes({ productName: "" });
    await createPriceHistoryController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("updatePriceHistoryController", () => {
  it("updates record", async () => {
    const record = { id: "1", productName: "Updated" };
    vi.mocked(svc.updatePriceHistoryRecord).mockResolvedValue(record as any);
    const { req, res } = mockReqRes({ productName: "Updated" }, { id: "1" });
    await updatePriceHistoryController(req, res);
    expect(res.json).toHaveBeenCalledWith(record);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.updatePriceHistoryRecord).mockResolvedValue(null);
    const { req, res } = mockReqRes({}, { id: "x" });
    await updatePriceHistoryController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deletePriceHistoryController", () => {
  it("deletes record", async () => {
    vi.mocked(svc.deletePriceHistoryRecord).mockResolvedValue(true as any);
    const { req, res } = mockReqRes({}, { id: "1" });
    await deletePriceHistoryController(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.deletePriceHistoryRecord).mockResolvedValue(null as any);
    const { req, res } = mockReqRes({}, { id: "x" });
    await deletePriceHistoryController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
