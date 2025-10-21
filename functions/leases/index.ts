import { AzureFunction, Context, HttpRequest } from "@azure/functions";
//handlers
import createLease from "../../src/handlers/lease/create-lease";
import getLease from "../../src/handlers/lease/get-lease";
//middleware
import { requireApiKey } from "../../src/lib/api-key-middleware";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest) => {
  try {
    // Check API Key
    if (!requireApiKey(context, req)) return;

    // create or get lease based on method
    if (req.method === "POST") {
      await createLease(context, req);
    } else if (req.method === "GET") {
      await getLease(context, req);
    } else {
      context.res = { status: 405, body: { error: "Method not allowed" } };
    }
  } 
  catch (e: any) {
    context.res = { 
      status: e.statusCode || 500, 
      body: { 
        error: e.message 
      } 
    };
  }
};

export default httpTrigger;

