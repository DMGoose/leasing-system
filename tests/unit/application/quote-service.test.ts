/**
 * Unit test: quote-service module
 */
import { buildSchedule } from "@src/application/quote-service";

describe("quote-service.buildSchedule", () => {
  //test normal case
  test("produces 12 installments and correct totals", () => {
    const { schedule, totals } = buildSchedule({
      companyId: "c-1",
      itemId: "macbook-pro",
      price: 1200,
      termMonths: 12,
      nominalRatePct: 6,
      startDate: "2025-10-01T00:00:00.000Z",
      upfrontFee: 50,
      monthlyFee: 5,
    });

    expect(schedule).toHaveLength(12);
    //monthly fee: 12 * 5 + upfront 50 = 110
    expect(totals.totalFees).toBeCloseTo(110, 2);
    //interest should be > 0
    expect(totals.totalInterest).toBeGreaterThan(0);
    //the last installment should be 0
    expect(schedule[schedule.length - 1].balanceAfter).toBeCloseTo(0, 2);
  });

  //test zero-rate case
  test("zero-rate degenerates to straight principal split + fees", () => {
    const { schedule, totals } = buildSchedule({
      companyId: "c-1",
      itemId: "camera",
      price: 1000,
      termMonths: 10,
      nominalRatePct: 0,
      startDate: "2025-01-01T00:00:00.000Z",
      upfrontFee: 0,
      monthlyFee: 0,
    });

    expect(totals.totalInterest).toBeCloseTo(0, 6);
    //every principal should be identical (allowing for floating point noise)
    const principals = schedule.map(i => i.principal);
    const mean = principals.reduce((s, x) => s + x, 0) / principals.length;
    principals.forEach(p => expect(Math.abs(p - mean)).toBeLessThan(0.02));
  });
});

