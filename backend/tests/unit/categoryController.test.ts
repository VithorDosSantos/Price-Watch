import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/services/categoryService", () => ({
  listCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

import {
  listCategoriesController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../../src/controllers/categoryController";
import * as svc from "../../src/services/categoryService";

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

describe("listCategoriesController", () => {
  it("returns categories", async () => {
    const cats = [{ id: "1", name: "Cat" }];
    vi.mocked(svc.listCategories).mockResolvedValue(cats as any);
    const { req, res } = mockReqRes();
    await listCategoriesController(req, res);
    expect(res.json).toHaveBeenCalledWith(cats);
  });
});

describe("createCategoryController", () => {
  it("creates category successfully", async () => {
    const cat = { id: "1", name: "New" };
    vi.mocked(svc.createCategory).mockResolvedValue(cat as any);
    const { req, res } = mockReqRes({ name: "New", description: "Desc" });
    await createCategoryController(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(cat);
  });

  it("returns 400 on error", async () => {
    vi.mocked(svc.createCategory).mockRejectedValue(new Error("fail"));
    const { req, res } = mockReqRes({ name: "" });
    await createCategoryController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("updateCategoryController", () => {
  it("updates category", async () => {
    const cat = { id: "1", name: "Updated" };
    vi.mocked(svc.updateCategory).mockResolvedValue(cat as any);
    const { req, res } = mockReqRes({ name: "Updated" }, { id: "1" });
    await updateCategoryController(req, res);
    expect(res.json).toHaveBeenCalledWith(cat);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.updateCategory).mockResolvedValue(null);
    const { req, res } = mockReqRes({}, { id: "x" });
    await updateCategoryController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteCategoryController", () => {
  it("deletes category", async () => {
    vi.mocked(svc.deleteCategory).mockResolvedValue(true as any);
    const { req, res } = mockReqRes({}, { id: "1" });
    await deleteCategoryController(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.deleteCategory).mockResolvedValue(null as any);
    const { req, res } = mockReqRes({}, { id: "x" });
    await deleteCategoryController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
