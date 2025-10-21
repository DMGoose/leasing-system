import { prisma } from "@src/lib/prisma";
import { Lease } from "@src/domain/lease";
import {
  toDomainLease,
  toPrismaLeaseCreate,
  toPrismaLeaseUpdate,
} from "./mappers";

export const LeaseRepository = {
  //create new lease
  async create(lease: Lease) {
    return prisma.lease.create({
      data: toPrismaLeaseCreate(lease),
    });
  },

  //get lease by id
  async getById(id: string): Promise<Lease | null> {
    const record = await prisma.lease.findUnique({ where: { id } });
    if (!record) return null;
    return record ? toDomainLease(record) : null;
  },

  //update existing lease
  async update(lease: Lease) {
    return prisma.lease.update({
      where: { id: lease.id },
      data: toPrismaLeaseUpdate(lease),
    });
  },
};
