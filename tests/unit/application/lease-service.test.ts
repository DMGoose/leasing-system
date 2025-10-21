/**
 * Unit test: LeaseService with mocked repositories (no Prisma)
 */
import { LeaseService } from "@src/application/lease-service";

// Mock lease-repository & payment-repository
jest.mock("@src/persistence/lease-repository", () => {
  const store: any = new Map();
  return {
    LeaseRepository: {
      create: jest.fn(async (lease: any) => {
        store.set(lease.id, lease);
        return lease;
      }),
      getById: jest.fn(async (id: string) => store.get(id) || null),
      update: jest.fn(async (lease: any) => {
        store.set(lease.id, lease);
        return lease;
      }),
      __store: store,
    },
  };
});

jest.mock("@src/persistence/payment-repository", () => {
  const payments: any[] = [];
  return {
    PaymentRepository: {
      create: jest.fn(async (p: any) => {
        payments.push(p);
        return p;
      }),
      listByLeaseId: jest.fn(async (leaseId: string) => payments.filter(x => x.leaseId === leaseId)),
      __payments: payments,
    },
  };
});

describe("LeaseService (unit, mocked repos)", () => {
  //test createLease
  test("createLease returns schedule and totals", async () => {
    const lease = await LeaseService.createLease({
      companyId: "c-1",
      itemId: "macbook-pro",
      price: 1200,
      termMonths: 12,
      nominalRatePct: 6,
      startDate: "2025-10-01T00:00:00.000Z",
      upfrontFee: 50,
      monthlyFee: 5,
    });

    expect(lease.id).toBeDefined();
    expect(lease.schedule).toHaveLength(12);
    expect(lease.totals.totalFees).toBeCloseTo(110, 2);
  });

  //test getLeaseWithBalance
  test("getLeaseWithBalance returns payments & remaining", async () => {
    const lease = await LeaseService.createLease({
      companyId: "c-2",
      itemId: "phone",
      price: 600,
      termMonths: 6,
      nominalRatePct: 6,
      startDate: "2025-10-01T00:00:00.000Z",
      upfrontFee: 0,
      monthlyFee: 0,
    });

    //add some data to mocked payment-repository
    const { PaymentRepository } = require("../../../src/persistence/payment-repository");
    await PaymentRepository.create({ id: "p1", leaseId: lease.id, amount: 100, paidAt: new Date().toISOString() });
    await PaymentRepository.create({ id: "p2", leaseId: lease.id, amount: 50,  paidAt: new Date().toISOString() });

    const result = await LeaseService.getLeaseWithBalance(lease.id);
    expect(result.lease.id).toBe(lease.id);
    expect(result.payments).toHaveLength(2);

    const scheduledTotal = lease.schedule.reduce((s, i) => s + i.payment, 0) + lease.upfrontFee;
    expect(result.remainingBalance).toBeCloseTo(scheduledTotal - 150, 2);
  });

  //test error
  test("getLeaseWithBalance throws 404 for unknown lease", async () => {
    await expect(LeaseService.getLeaseWithBalance("does-not-exist")).rejects.toThrow("Lease not found");
  });
});