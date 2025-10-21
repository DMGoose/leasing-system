import { prisma } from "@src/lib/prisma";
import { Payment } from "@src/domain/payment";

export const PaymentRepository = {
  
  async create(p: Payment) {
    return prisma.payment.create({ data: p });
  },

  async listByLeaseId(leaseId: string) {
    return prisma.payment.findMany({ where: { leaseId } });
  },
};
