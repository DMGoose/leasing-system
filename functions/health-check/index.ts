import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.res = {
    status: 200,
    body: { 
      status: "ok", 
      message: "Leasing API is running" 
    }
  };
};

export default httpTrigger;