//domain
import { LeaseInput, Lease } from "@src/domain/lease";
//persistence
import { LeaseRepository } from "@src/persistence/lease-repository";
import { PaymentRepository } from "@src/persistence/payment-repository";
//domain functions
import { buildSchedule, round } from "./quote-service";

//simple UUID generator for demo purposes
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * LeaseService provides two methods 
 * 1. Create leases. 
 * 2. Retrieve lease details with balance.
 */
const LeaseService = {
  /**
   * Creates a new lease and persists it to the repository.
   *
   * @param {LeaseInput} leaseInput - The lease data
   * @returns {Promise<Lease>} The newly created lease record
   */
  async createLease(leaseInput: LeaseInput): Promise<Lease> {
    //build schedule and totals
    const { schedule, totals } = buildSchedule(leaseInput);

    //create lease object
    const lease: Lease = {
      ...leaseInput,
      id: uuid(),
      createdAt: new Date().toISOString(),
      schedule,
      totals
    };

    //persist lease in repository
    await LeaseRepository.create(lease);

    //return created lease
    return lease;
  },

  /**
   * Retrieves a lease by its ID along with its associated payments and remaining balance.
   *
   * @param {string} leaseId - A unique identifier
   * @returns {Promise<{ lease: Lease; payments: Payment[]; remainingBalance: number }>}
   *          An object containing the lease record, related payments, and the calculated remaining balance.
   */
  async getLeaseWithBalance(leaseId: string) {
    //get lease from repository
    const lease = await LeaseRepository.getById(leaseId);

    //check lease exists
    if (!lease)
      throw Object.assign(new Error("Lease not found"), {
        statusCode: 404
      });

    //get payments from repository
    const payments = await PaymentRepository.listByLeaseId(leaseId);

    //calculate remaining balance
    const paidTotal = payments.reduce((s, p) => s + p.amount, 0);

    //calculate scheduled total
    const scheduledTotal = lease.schedule.reduce((s, i) => s + i.payment, 0) + lease.upfrontFee;

    //calculate remaining balance
    const remainingBalance = Math.max(0, round(scheduledTotal - paidTotal));

    return {
      lease,
      payments,
      remainingBalance
    };
  },
};

export { LeaseService };