import { describe, expect, it, vi } from "vitest";
import request from "supertest";

// Stub DB so the route's SELECT 1 resolves without a real connection.
vi.mock("../common/db/index.js", () => ({
  db: { execute: vi.fn().mockResolvedValue([{ "?column?": 1 }]) },
  connectDB: vi.fn(),
  closeDB: vi.fn(),
}));

const app = (await import("../app.js")).default;

describe("GET /api/health", () => {
  it("returns 200 with status and time", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(typeof res.body.time).toBe("string");
  });
});