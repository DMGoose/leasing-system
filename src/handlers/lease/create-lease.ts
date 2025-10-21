import { Context, HttpRequest } from "@azure/functions";
//service
import { LeaseService } from "@src/application/lease-service";
//validation
import { parse, LeaseInputSchema } from "@src/lib/validation";

async function createLease(context: Context, req: HttpRequest) {
  //validate and parse input
  const dto = parse(LeaseInputSchema, req.body);

  //use service to create lease
  const lease = await LeaseService.createLease(dto);

  //set return response
  context.res = { 
    status: 201, 
    body: lease 
  };
}

export default createLease;
