import { Lease } from "@src/domain/lease";
import { Prisma } from "@prisma/client";
import { safeStringify, stripUndefined } from "@src/utils";

export function toPrismaLeaseUpdate(domain: Lease): Prisma.LeaseUpdateInput {
const payload: any = {
    ...(domain.companyId !== undefined && { companyId: domain.companyId }),
    ...(domain.itemId !== undefined && { itemId: domain.itemId }),
    ...(domain.price !== undefined && { price: domain.price }),
    ...(domain.termMonths !== undefined && { termMonths: domain.termMonths }),
    ...(domain.nominalRatePct !== undefined && { nominalRatePct: domain.nominalRatePct }),
    ...(domain.startDate !== undefined && { startDate: domain.startDate === null ? null : new Date(domain.startDate) }),
    ...(domain.upfrontFee !== undefined && { upfrontFee: domain.upfrontFee }),
    ...(domain.monthlyFee !== undefined && { monthlyFee: domain.monthlyFee }),
    ...( (domain as any).schedule !== undefined && { scheduleJson: safeStringify((domain as any).schedule) }),
    ...( (domain as any).totals !== undefined && { totalsJson: safeStringify((domain as any).totals) }),
  };

  return stripUndefined(payload) as Prisma.LeaseUpdateInput;
}
