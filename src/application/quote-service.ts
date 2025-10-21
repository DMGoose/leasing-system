//domain
import { Installment, LeaseInput, Lease } from "@src/domain/lease";

/**
 * Builds a full payment schedule and calculates total amounts for a lease.
 *
 * @param {LeaseInput} input - The lease input data.
 * @returns An object containing:
 *   - schedule: The list of all installments with detailed breakdowns.
 *   - totals: Aggregate totals of payments, interest, and fees.
 */
function buildSchedule(input: LeaseInput): { schedule: Installment[], totals: Lease["totals"] } {
  const principal0 = input.price; //optional: upfrontFee is treated as a separate cost, not deducted from principal
  const n = input.termMonths;
  const monthlyPay = monthlyAnnuity(principal0, input.nominalRatePct, n);
  let balance = principal0;
  const schedule: Installment[] = [];
  let totalInterest = 0;
  let totalFees = input.upfrontFee; //include upfront fee in total fees

  for (let i = 1; i <= n; i++) {
    const interest = balance * (input.nominalRatePct / 100 / 12);
    const principal = Math.min(balance, monthlyPay - interest);
    balance = Math.max(0, balance - principal);
    const fee = input.monthlyFee;
    const payment = principal + interest + fee;
    totalInterest += interest;
    totalFees += fee;
    schedule.push({
      period: i,
      dueDate: addMonths(input.startDate, i - 1),
      payment: round(payment),
      interest: round(interest),
      principal: round(principal),
      fee: round(fee),
      balanceAfter: round(balance),
    });
  }
  const totalPayments = round(schedule.reduce((s, i) => s + i.payment, 0) + input.upfrontFee);
  return {
    schedule,
    totals: { 
      totalPayments, 
      totalInterest: round(totalInterest), 
      totalFees: round(totalFees) }
  };
}

/**
 * Calculates the fixed monthly payment amount (annuity) for a loan or lease.
 *
 * @param {number} principal - The principal amount (initial loan or lease price).
 * @param {number} annualRatePct - The nominal annual interest rate as a percentage.
 * @param {number} n - The total number of monthly payments.
 * @returns The monthly payment amount.
 */
function monthlyAnnuity(principal: number, annualRatePct: number, n: number) {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  const a = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return a;
}

/**
 * Adds a given number of months to an ISO date string.
 *
 * @param dateISO - The start date in ISO format.
 * @param months - Number of months to add.
 * @returns The resulting date in ISO string format.
 */
function addMonths(dateISO: string, months: number): string {
  const date = new Date(dateISO);
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
}

/**
 * Rounds a number to two decimal places.
 *
 * @param {number} n - The number to round.
 * @returns The rounded number with two decimal precision.
 */
function round(n: number) { 
  return Math.round(n * 100) / 100; 
}

export { buildSchedule, round };
