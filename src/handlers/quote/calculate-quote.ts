import { Context, HttpRequest } from "@azure/functions";
//service
import { buildSchedule } from "@src/application/quote-service";
//validation
import { parse, QuoteSchema } from "@src/lib/validation";


export default async function calculateQuote(context: Context, req: HttpRequest) {
  //validate and parse input
  const dto = parse(QuoteSchema, req.body);

  //default startDate to now if not provided
  const startDate = dto.startDate ?? new Date().toISOString();

  //use service to get schedule and totals
  const { schedule, totals } = buildSchedule({ ...dto, startDate });
  
  //set return response
  context.res = { 
    status: 200, 
    body: { schedule, totals } 
  };
}
