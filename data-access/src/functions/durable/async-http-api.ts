import * as df from "durable-functions";
import { app, HttpHandler, HttpRequest, HttpResponse, InvocationContext } from "@azure/functions";
import { OrchestrationHandler, OrchestrationContext, ActivityHandler } from "durable-functions";
import { DateTime } from "luxon";

const startOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const deadline = DateTime.fromJSDate(context.df.currentUtcDateTime, { zone: "utc" }).plus({ seconds: 10 });
  yield context.df.createTimer(deadline.toJSDate()); // mimic long-running activity
  console.log("startOrchestrator completed");
  return {
    deadline: deadline.toISO(),
  
  }
};
df.app.orchestration("start-orchestrator", startOrchestrator);

const httpStart: HttpHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponse> => {
  const client = df.getClient(context);
  const body: unknown = await request.json();
  console.log("start orchestration...");
  const instanceId: string = await client.startNew(request.params.orchestratorName, {
    input: body,
  });

  context.log(`Started orchestration with ID = '${instanceId}'.`);
  return client.createCheckStatusResponse(request, instanceId);
};

app.http("httpStart", {
  route: "orchestrators/{orchestratorName}",
  extraInputs: [df.input.durableClient()],
  handler: httpStart,
});


