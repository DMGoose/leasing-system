import type { Lease as LeaseRecord } from "@prisma/client";
import type { Lease, Installment } from "@src/domain/lease";
import { safeParseJson } from "@src/utils";

export function toDomainLease(record: LeaseRecord): Lease {
  return {
    id: record.id,
    companyId: record.companyId,
    itemId: record.itemId,
    price: typeof record.price === "number" ? record.price : Number(record.price || 0),
    termMonths: record.termMonths,
    nominalRatePct: typeof record.nominalRatePct === "number" ? record.nominalRatePct : Number(record.nominalRatePct || 0),
    startDate: record.startDate ? (record.startDate instanceof Date ? record.startDate.toISOString() : String(record.startDate)) : "",
    upfrontFee: typeof record.upfrontFee === "number" ? record.upfrontFee : Number(record.upfrontFee || 0),
    monthlyFee: typeof record.monthlyFee === "number" ? record.monthlyFee : Number(record.monthlyFee || 0),
    createdAt: record.createdAt ? (record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt)) : "",
    schedule: safeParseJson<Installment[]>(record.scheduleJson) ?? [],
    totals: safeParseJson<any>(record.totalsJson),
  };
}
