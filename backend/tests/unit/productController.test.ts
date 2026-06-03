import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/services/productService", () => ({
  createProduct: vi.fn(),
  searchProducts: vi.fn(),
  getProductById: vi.fn(),
  listProductPriceHistory: vi.fn(),
  listProductComparableOffers: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  SerpApiError: class SerpApiError extends Error {
    status: number;
    body: string;
    constructor(msg: string, status: number, body: string) {
      super(msg);
      this.status = status;
      this.body = body;
    }
  },
  ProductDeleteConflictError: class ProductDeleteConflictError extends Error {
    dependencySummary: any;
    constructor(msg: string, summary: any) {
      super(msg);
      this.dependencySummary = summary;
    }
  },
}));

import {
  createProductController,
  searchProductsController,
  getProductDetailsController,
  listProductHistoryController,
  listProductOffersController,
  updateProductController,
  deleteProductController,
} from "../../src/controllers/productController";
import * as svc from "../../src/services/productService";

function mockReqRes(
  body: any = {},
  params: any = {},
  query: any = {},
  user: any = { id: "u1", role: "ADMIN" }
) {
  const req = { body, params, query, user } as any;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as any;
  return { req, res };
}

beforeEach(() => vi.clearAllMocks());

describe("searchProductsController", () => {
  it("searches products", async () => {
    const result = { products: [], page: 1, totalPages: 1 };
    vi.mocked(svc.searchProducts).mockResolvedValue(result as any);
    const { req, res } = mockReqRes({}, {}, { q: "phone", page: "1", limit: "8" });
    await searchProductsController(req, res);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it("returns 400 for invalid page", async () => {
    const { req, res } = mockReqRes({}, {}, { q: "x", page: "-1", limit: "8" });
    await searchProductsController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 for limit > 24", async () => {
    const { req, res } = mockReqRes({}, {}, { q: "x", page: "1", limit: "50" });
    await searchProductsController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("handles SerpApiError", async () => {
    vi.mocked(svc.searchProducts).mockRejectedValue(
      new svc.SerpApiError("API err", 503, "body")
    );
    const { req, res } = mockReqRes({}, {}, { q: "x", page: "1", limit: "8" });
    await searchProductsController(req, res);
    expect(res.status).toHaveBeenCalledWith(503);
  });

  it("handles generic error", async () => {
    vi.mocked(svc.searchProducts).mockRejectedValue(new Error("fail"));
    const { req, res } = mockReqRes({}, {}, { q: "x", page: "1", limit: "8" });
    await searchProductsController(req, res);
    expect(res.status).toHaveBeenCalledWith(502);
  });
});

describe("getProductDetailsController", () => {
  it("returns product", async () => {
    const product = { id: "1", name: "P" };
    vi.mocked(svc.getProductById).mockResolvedValue(product as any);
    const { req, res } = mockReqRes({}, { id: "1" });
    await getProductDetailsController(req, res);
    expect(res.json).toHaveBeenCalledWith(product);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.getProductById).mockResolvedValue(null);
    const { req, res } = mockReqRes({}, { id: "x" });
    await getProductDetailsController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 502 on error", async () => {
    vi.mocked(svc.getProductById).mockRejectedValue(new Error("fail"));
    const { req, res } = mockReqRes({}, { id: "1" });
    await getProductDetailsController(req, res);
    expect(res.status).toHaveBeenCalledWith(502);
  });
});

describe("updateProductController", () => {
  it("updates product", async () => {
    const product = { id: "1", name: "Updated" };
    vi.mocked(svc.updateProduct).mockResolvedValue(product as any);
    const { req, res } = mockReqRes({ name: "Updated", price: 10 }, { id: "1" });
    await updateProductController(req, res);
    expect(res.json).toHaveBeenCalledWith(product);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.updateProduct).mockResolvedValue(null);
    const { req, res } = mockReqRes({ name: "X" }, { id: "x" });
    await updateProductController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 400 for empty name", async () => {
    const { req, res } = mockReqRes({ name: "  " }, { id: "1" });
    await updateProductController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 for invalid price", async () => {
    const { req, res } = mockReqRes({ price: -5 }, { id: "1" });
    await updateProductController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("createProductController", () => {
  it("creates a product", async () => {
    const product = { id: "1", name: "Produto" };
    vi.mocked(svc.createProduct).mockResolvedValue(product as any);
    const { req, res } = mockReqRes({ name: "Produto", price: 100 });

    await createProductController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(product);
  });

  it("returns 400 for invalid name", async () => {
    const { req, res } = mockReqRes({ name: "", price: 100 });
    await createProductController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 for invalid price", async () => {
    const { req, res } = mockReqRes({ name: "Produto", price: 0 });
    await createProductController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("listProductHistoryController", () => {
  it("returns records", async () => {
    vi.mocked(svc.listProductPriceHistory).mockResolvedValue([
      { id: "h1", oldPrice: 100, newPrice: 90, capturedAt: new Date().toISOString() }
    ] as any);
    const { req, res } = mockReqRes({}, { id: "p1" });

    await listProductHistoryController(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("returns 404 when product is missing", async () => {
    vi.mocked(svc.listProductPriceHistory).mockResolvedValue(null as any);
    const { req, res } = mockReqRes({}, { id: "missing" });

    await listProductHistoryController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("listProductOffersController", () => {
  it("returns offers", async () => {
    vi.mocked(svc.listProductComparableOffers).mockResolvedValue([
      { externalId: "x", name: "P", price: 10 }
    ] as any);
    const { req, res } = mockReqRes({}, { id: "p1" }, { limit: "5" });

    await listProductOffersController(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("returns 400 for invalid limit", async () => {
    const { req, res } = mockReqRes({}, { id: "p1" }, { limit: "99" });
    await listProductOffersController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when product is missing", async () => {
    vi.mocked(svc.listProductComparableOffers).mockResolvedValue(null as any);
    const { req, res } = mockReqRes({}, { id: "missing" }, { limit: "5" });

    await listProductOffersController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteProductController", () => {
  it("deletes product", async () => {
    vi.mocked(svc.deleteProduct).mockResolvedValue(true as any);
    const { req, res } = mockReqRes({}, { id: "1" });
    await deleteProductController(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(svc.deleteProduct).mockResolvedValue(null as any);
    const { req, res } = mockReqRes({}, { id: "x" });
    await deleteProductController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 409 on conflict", async () => {
    vi.mocked(svc.deleteProduct).mockRejectedValue(
      new svc.ProductDeleteConflictError("conflict", { alerts: 2 })
    );
    const { req, res } = mockReqRes({}, { id: "1" });
    await deleteProductController(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });
});
