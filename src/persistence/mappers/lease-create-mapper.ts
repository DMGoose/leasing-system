import { Lease } from "@src/domain/lease";
import { Prisma } from "@prisma/client";
import { safeStringify } from "@src/utils";

export function toPrismaLeaseCreate(domain: Lease): Prisma.LeaseCreateInput {
  return {
    id: domain.id, 
    companyId: domain.companyId,
    itemId: domain.itemId,
    price: domain.price,
    termMonths: domain.termMonths,
    nominalRatePct: domain.nominalRatePct,
    startDate: new Date(domain.startDate),
    upfrontFee: domain.upfrontFee,
    monthlyFee: domain.monthlyFee,
    scheduleJson: safeStringify((domain as any).schedule ?? []),
    totalsJson: safeStringify((domain as any).totals ?? null),
  };
}
