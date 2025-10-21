import { AzureFunction, Context, HttpRequest } from "@azure/functions";
//handler
import recordPayment from "../../src/handlers/payment/record-payment";
//middleware
import { requireApiKey } from "../../src/lib/api-key-middleware";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest) => {
  try {
    // Check API Key
    if (!requireApiKey(context, req)) return;

    // record payment
    await recordPayment(context, req);
    
  } 
  catch (e: any) {
    context.res = { 
      status: e.statusCode || 500, 
      body: { error: e.message } 
    };
  }
};
export default httpTrigger;
