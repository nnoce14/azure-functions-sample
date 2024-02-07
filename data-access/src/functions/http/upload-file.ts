import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { blobOutput } from "../blobStorage";

export async function getUploadFile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`HTTP function processed request for url ${request.url}`);
  const body = await request.body;

  context.extraOutputs.set(blobOutput, (await body.values().next()).value);
  return { body: `Uploaded: ${request.url}` };
}

app.http("uploadFile", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  extraOutputs: [blobOutput],
  route: "http/upload-file/{filePath}",
  handler: getUploadFile,
});