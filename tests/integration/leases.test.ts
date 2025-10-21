import leasesFunc from "../../functions/leases/index";
import { prisma } from "@src/lib/prisma";

process.env.API_KEY = process.env.TEST_API_KEY || "local-dev-key";
jest.resetModules();

function makeContext(method: "GET" | "POST", id?: string) {
  const bindingData: any = {};
  if (id) bindingData.id = id;
  return {
    log: (...args: any[]) => console.log(...args),
    bindingData,
    res: undefined as any,
  };
}

function makeReq(method: string, body?: any, headers?: Record<string, string>) {
  return {
    method,
    headers: { "x-api-key": "local-dev-key", ...(headers || {}) } as any,
    body,
    query: {},
    params: {},
  } as any;
}

describe("Integration: /api/leases", () => {
  //clean database before each test
  beforeEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.lease.deleteMany();
  });

  //test POST then GET lease
  test("POST then GET lease", async () => {
    //create lease first
    const createCtx = makeContext("POST");
    const createReq = makeReq("POST", {
      companyId: "comp-123",
      itemId: "macbook-pro",
      price: 1200,
      termMonths: 12,
      nominalRatePct: 6,
      startDate: "2025-10-01T00:00:00.000Z",
      upfrontFee: 50,
      monthlyFee: 5,
    });

    await leasesFunc(createCtx as any, createReq as any);
    expect(createCtx.res.status).toBe(201);

    //now GET it back
    const id = createCtx.res.body.id as string;
    const getCtx = makeContext("GET", id);
    const getReq = makeReq("GET");
    await leasesFunc(getCtx as any, getReq as any);

    expect(getCtx.res.status).toBe(200);
    expect(getCtx.res.body.lease.id).toBe(id);
    expect(getCtx.res.body.remainingBalance).toBeGreaterThan(0);
  });

  //test no API key
  test("GET 401 when no API key", async () => {
    const ctx = makeContext("GET", "whatever");
    const req = makeReq("GET", undefined, { "x-api-key": "" });
    await leasesFunc(ctx as any, req as any);
    expect(ctx.res.status).toBe(401);
    expect(ctx.res.body.error).toBe("Unauthorized");
  });
});