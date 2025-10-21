import { Context, HttpRequest } from "@azure/functions";
//service
import { LeaseService } from "@src/application/lease-service";

async function getLease(ctx: Context, req: HttpRequest) {
  const id = ctx.bindingData?.id as string;
  const result = await LeaseService.getLeaseWithBalance(id);
  ctx.res = { 
    status: 200, 
    body: result 
  };
}

export default getLease;
