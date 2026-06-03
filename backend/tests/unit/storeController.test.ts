import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/services/storeService", () => ({
  listStores: vi.fn(),
  createStore: vi.fn(),
  updateStore: vi.fn(),
  deleteStore: vi.fn(),
  deleteStoreOwned: vi.fn(),
}));

import {
  listStoresController,
  createStoreController,
  updateStoreController,
  deleteStoreController,
} from "../../src/controllers/storeController";
import * as svc from "../../src/services/storeService";

function mockReqRes(body: any = {}, params: any = {}, user: any = { id: "u1", role: "ADMIN" }) {
  const req = { body, params, user } as any;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as any;
  return { req, res };
}

beforeEach(() => vi.clearAllMocks());

describe("listStoresController", () => {
  it("returns stores", async () => {
    const stores = [{ id: "1", name: "Store" }];
    vi.mocked(svc.listStores).mockResolvedValue(stores as any);
    const { req, res } = mockReqRes();
    await listStoresController(req, res);
    expect(res.json).toHaveBeenCalledWith(stores);
  });
});

describe("createStoreController", () => {
  it("creates store successfully", async () => {
    const store = { id: "1", name: "New" };
    vi.mocked(svc.createStore).mockResolvedValue(store as any);
    const { req, res } = mockReqRes({ name: "New", website: "https://x.com", contactEmail: "a@b.com" });
    await createStoreController(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(store);
  });

  it("returns 400 on error", async () => {
    vi.mocked(svc.createStore).mockRejectedValue(new Error("fail"));
    const { req, res } = mockReqRes({ name: "" });
    await createStoreController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("updateStoreController", () => {
  it("updates store", async () => {
    const store = { id: "1", name: "Updated" };
    vi.mocked(svc.updateStore).mockResolvedValue(store as any);
    const { req, res } = mockReqRes({ name: "Updated" }, { id: "1" });
    await updateStoreController(req, res);
    expect(res.json).toHaveBeenCalledWith(store);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.updateStore).mockResolvedValue(null);
    const { req, res } = mockReqRes({}, { id: "x" });
    await updateStoreController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteStoreController", () => {
  it("deletes store", async () => {
    vi.mocked(svc.deleteStoreOwned).mockResolvedValue(true as any);
    const { req, res } = mockReqRes({}, { id: "1" });
    await deleteStoreController(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.deleteStoreOwned).mockResolvedValue(null as any);
    const { req, res } = mockReqRes({}, { id: "x" });
    await deleteStoreController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
