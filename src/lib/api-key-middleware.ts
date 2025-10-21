import { Context, HttpRequest } from "@azure/functions";

//middleware to require API key
function requireApiKey(context: Context, req: HttpRequest) {
  const apiKey = process.env.API_KEY;
  const given = req.headers["x-api-key"];

  context.log("API_KEY (want):", apiKey);
  context.log("All headers:", req.headers);

  if (!apiKey || !given || given !== apiKey) {
    context.res = {
      status: 401,
      body: { error: "Unauthorized" },
    };
    return false;
  }
  return true;
}

export {requireApiKey};