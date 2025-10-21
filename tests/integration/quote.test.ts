import quoteFunc from "../../functions/quote/index";
import { prisma } from "@src/lib/prisma";

function ctx(method: string) {
  return { 
    log: (...args: any[]) => console.log(...args), 
    bindingData: {}, 
    res: undefined as any };
}

function req(method: string, body?: any, headers?: Record<string, string>) {
  return {
    method,
    headers: { "x-api-key": "local-dev-key", ...(headers || {}) } as any,
    body,
    query: {},
    params: {},
  } as any;
}

describe("Integration: /api/quote", () => {
  //clean database before each test
  beforeEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.lease.deleteMany();
  });

  //test quote generation
  test("returns schedule and totals without persisting", async () => {
    const c = ctx("POST");
    const r = req("POST", {
      companyId: "comp-123",
      itemId: "macbook",
      price: 1200,
      termMonths: 12,
      nominalRatePct: 6,
      upfrontFee: 50,
      monthlyFee: 5
    });

    await quoteFunc(c as any, r as any);
    expect(c.res.status).toBe(200);

    expect(Array.isArray(c.res.body.schedule)).toBe(true);
    expect(c.res.body.schedule.length).toBe(12);
    expect(c.res.body.totals.totalFees).toBe(110);
  });

  //test no API key
  test("401 without API key", async () => {
    const c = ctx("POST");
    const r = req("POST", { price: 1000 }, { "x-api-key": "" });
    await quoteFunc(c as any, r as any);
    expect(c.res.status).toBe(401);
  });
});
