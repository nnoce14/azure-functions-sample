import { DurableOrchestrationContext } from "durable-functions";
import { calculator } from "./calculator-example";
import {
  HttpHandler,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from "@azure/functions";
import * as df from "durable-functions";

df.app.entity("entityDemo", function (context) {
  const currentValue = context.df.getState(() => 0) as number;
  switch (context.df.operationName) {
    case "add":
      const amount = context.df.getInput() as number;
      context.df.setState(currentValue + amount);
      break;
    case "reset":
      context.df.setState(0);
      break;
    case "get":
      context.df.return(currentValue);
      break;
  }
});

const signalEntityDemoHandler: HttpHandler = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  const client = df.getClient(context);
  const entityId = new df.EntityId("entityDemo", "myCounter");
  const amount = Number(request.query.get("amount") ?? "0") || 1;
  const action = request.query.get("action") || "add";
  await client.signalEntity(entityId, action, amount);

  if (action === "get") {
    const result = await client.readEntityState(entityId);
    return {
      status: 200,
      body: JSON.stringify({
        amount,
        action,
        result,
      }),
    };
  }

  return {
    status: 200,
    body: JSON.stringify({
      amount,
      action,
    }),
  };
};

app.get("signalEntityDemo", {
  handler: signalEntityDemoHandler,
  route: "signalEntityDemo",
  extraInputs: [df.input.durableClient()],
});
