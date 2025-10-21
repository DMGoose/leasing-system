import { Context, HttpRequest } from "@azure/functions";
//service
import { PaymentService } from "@src/application/payment-service";
//validation
import { parse, PaymentSchema } from "@src/lib/validation";

async function recordPayment(context: Context, req: HttpRequest) {
  //validate and parse input
  const dto = parse(PaymentSchema, req.body);

  //use service to record payment
  const payment = await PaymentService.recordPayment(dto.leaseId, dto.amount, dto.paidAt);

  //set return response
  context.res = { 
    status: 201, 
    body: payment
  };
}

export default recordPayment;
