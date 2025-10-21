//domain
import { Payment } from "@src/domain/payment";
//persistence
import { LeaseRepository } from "@src/persistence/lease-repository";
import { PaymentRepository } from "@src/persistence/payment-repository";
//domain functions
import { round } from "./quote-service";

/**
 * PaymentService provides methods to record payments against leases.
 * 
 * This function validates that the lease exists, creates a payment record
 * with a unique ID and timestamp, and persists it to the database.
 * 
 * @param {string} leaseId - The unique identifier of the lease associated with the payment.
 * @param {number} amount - The payment amount to record.
 * @param {string} when - Optional ISO timestamp of the payment date. Defaults to the current time.
 * @returns {Promise<Payment>} The created payment record containing ID, lease ID, amount, and timestamp.
 */
const PaymentService = {
  async recordPayment(leaseId: string, amount: number, when?: string): Promise<Payment> {
    //verify lease exists
    const lease = await LeaseRepository.getById(leaseId);
    if (!lease) throw Object.assign(new Error("Lease not found"), { 
      statusCode: 404 
    });

    //create payment record
    const payment: Payment = {
      id: Math.random().toString(36).slice(2),
      leaseId,
      amount: round(amount),
      paidAt: when ?? new Date().toISOString(),
    };

    //persist payment
    await PaymentRepository.create(payment);

    //return created payment
    return payment;
  },
};

export { PaymentService };