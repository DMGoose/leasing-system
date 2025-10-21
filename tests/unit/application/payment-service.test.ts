/**
 * Unit test: PaymentService with mocked repositories (no Prisma)
 */
import { LeaseService } from "../../../src/application/lease-service";
import { PaymentService } from "../../../src/application/payment-service";

// Mock lease-repository & payment-repository
jest.mock("@src/persistence/lease-repository", () => {
  const store: any = new Map();
  return {
    LeaseRepository: {
      create: async (lease: any) => { 
        store.set(lease.id, lease); 
        return lease; 
      },
      getById: async (id: string) => 
        store.get(id) || null,
      update: async (lease: any) => { 
        store.set(lease.id, lease); return lease; 
      },
      __store: store
    },
  };
});

jest.mock("@src/persistence/payment-repository", () => {
  const payments: any[] = [];
  return {
    PaymentRepository: {
      create: async (p: any) => { payments.push(p); return p; },
      listByLeaseId: async (leaseId: string) => payments.filter(x => x.leaseId === leaseId),
      __payments: payments
    },
  };
});

describe("PaymentService (unit, mocked repos)", () => {
  //test recordPayment
  test("records a payment and returns correct shape", async () => {
    const lease = await LeaseService.createLease({
      companyId: "c-3",
      itemId: "router",
      price: 300,
      termMonths: 6,
      nominalRatePct: 3,
      startDate: "2025-01-01T00:00:00.000Z",
      upfrontFee: 0,
      monthlyFee: 0,
    });

    const payment = await PaymentService.recordPayment(lease.id, 75);

    expect(payment.id).toBeDefined();
    expect(payment.leaseId).toBe(lease.id);
    expect(payment.amount).toBe(75);
    expect(payment.paidAt).toBeTruthy();
  });

  //test error
  test("throws 404 when lease not found", async () => {
    await expect(PaymentService.recordPayment("nope", 10)).rejects.toThrow("Lease not found");
  });
});