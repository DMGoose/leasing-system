import leasesFunc from "../../functions/leases/index";
import paymentsFunc from "../../functions/payments/index";
import { prisma } from "@src/lib/prisma";

function ctx(method: string, id?: string) {
  const bindingData: any = {};
  if (id) bindingData.id = id;
  return { 
    log: (...args: any[]) => console.log(...args),
    bindingData, 
    res: undefined as any, 
  };
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

describe("Integration: /api/payments", () => {
  beforeEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.lease.deleteMany();
  });

  test("record payment reduces remaining balance", async () => {
    //create lease first
    const c1 = ctx("POST");
    const r1 = req("POST", {
      companyId: "comp-1",
      itemId: "camera",
      price: 1000,
      termMonths: 10,
      nominalRatePct: 5,
      startDate: "2025-10-01T00:00:00.000Z",
      upfrontFee: 50,
      monthlyFee: 5,
    });
    await leasesFunc(c1 as any, r1 as any);
    expect(c1.res.status).toBe(201);
    const id = c1.res.body.id as string;

    //initial remaining
    const cGet1 = ctx("GET", id);
    const rGet1 = req("GET");
    await leasesFunc(cGet1 as any, rGet1 as any);
    const initialRemain = cGet1.res.body.remainingBalance;

    //record payment
    const cPay = ctx("POST");
    const rPay = req("POST", { leaseId: id, amount: 150 });
    await paymentsFunc(cPay as any, rPay as any);
    expect(cPay.res.status).toBe(201);

    //remaining decreased
    const cGet2 = ctx("GET", id);
    const rGet2 = req("GET");
    await leasesFunc(cGet2 as any, rGet2 as any);
    const afterRemain = cGet2.res.body.remainingBalance;

    expect(afterRemain).toBeLessThan(initialRemain);
    expect(cGet2.res.body.payments).toHaveLength(1);
  });
});
