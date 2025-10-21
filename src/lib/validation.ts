//Validation Schemas and Types
import { z } from "zod";

//validation
export const LeaseInputSchema = z.object({
  companyId: z.string().min(1),
  itemId: z.string().min(1),
  price: z.number().positive(),
  termMonths: z.number().int().min(1),
  nominalRatePct: z.number().min(0),
  startDate: z.string().datetime(),
  upfrontFee: z.number().min(0),
  monthlyFee: z.number().min(0),
});

export const PaymentSchema = z.object({
  leaseId: z.string().min(1),
  paidAt: z.string().datetime().optional(), // default now
  amount: z.number().positive(),
});

export const QuoteSchema = LeaseInputSchema.omit({ 
  startDate: true 
}).extend({
  startDate: z.string().datetime().optional(), //can be optional
});

export type LeaseInputDTO = z.infer<typeof LeaseInputSchema>;
export type PaymentDTO = z.infer<typeof PaymentSchema>;
export type QuoteDTO = z.infer<typeof QuoteSchema>;

//Parse 
export function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues
      .map(i => `${i.path.join(".")}: ${i.message}`).join("; ");
    const err: any = new Error(`ValidationError: ${msg}`);
    err.statusCode = 400;
    throw err;
  }
  return result.data;
}