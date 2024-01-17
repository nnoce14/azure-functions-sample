import * as df from "durable-functions";
import { DateTime } from "luxon";
import { OrchestrationHandler, OrchestrationContext } from "durable-functions";

const { app } = require("@azure/functions");

const approvalActivityName = "approveRequest";
const processApprovalActivityName = "processApproval";
const escalateActivityName = "escalate";

const ApprovalEventName = "ApprovalEvent";

df.app.client.http("submitRequestApproval", {
  route: "orchestrators/{orchestratorName}",
  handler: async (request, client, context) => {
    const body = await request.json();
    const instanceId = await client.startNew(request.params.orchestratorName, {
      input: body,
    });

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    console.log("============== submitRequestApproval ==============");
    // console.log(context)
    // console.log("Body: ", body);
    // console.log(request)
    return client.createCheckStatusResponse(request, instanceId);
  },
});

df.app.orchestration("requestApproval", function* (context) {
  console.log("============== requestApproval ==============");
  console.log(context);

  const request = context.df.getInput();
  if (!request) {
    throw new Error("Something's required man idk");
  }

  console.log(request);
  let approved = false;

  const expiration = DateTime.fromJSDate(context.df.currentUtcDateTime).plus({
    hours: 1,
  });

  const timeoutTask = context.df.createTimer(expiration.toJSDate());
  const approvalEventTask = context.df.waitForExternalEvent(ApprovalEventName);

  const winningEvent = yield context.df.Task.any([
    approvalEventTask,
    timeoutTask,
  ]);

  if (winningEvent === approvalEventTask) {
    console.log("============== response! ==============");
    timeoutTask.cancel();

    // approved = !!approvalEventTask.result;

    console.log("raw response:", approvalEventTask.result)
    // console.log("approved?", approved)

    if (approved) {
      console.log("============== approved! ==============");
    } else {
      console.log("============== not approved! ==============");
    }

    // yield context.df.callActivity(
    //   processApprovalActivityName,
    //   approvalEventTask.result
    // );

  } else {
    console.log("============== escalation ==============");
    yield context.df.callActivity(escalateActivityName);
  }

  if (!timeoutTask.isCompleted) {
    timeoutTask.cancel();
  }

  console.log(`Approved: ${approved}`);
  return approved;
});

df.app.activity(approvalActivityName, {
  handler: function (context) {
    context.log(`============== approvalActivity ==============`);
  },
});

app.http("approveRequest", {
  route: "orchestrators/{orchestratorName}/input",
  extraInputs: [df.input.durableClient()],
  handler: async (request, context) => {
    const client = df.getClient(context);

    console.log("============== durableHttpStart (client http) ==============");
    // console.log("request:\n", await request.json());
    // console.log("context:\n", context);
    // console.log("client:\n", client)

    // console.log("All status: ", await client.getStatusAll())

    const res = await request.json();
    const instanceId: string = res.instanceId;
    const isApproved: boolean = res.approved;

    await client.raiseEvent(instanceId, "ApprovalEvent", isApproved);
  },
});

// TODO - create an API that uses client.getStatusAll() to get all statuses and bubbles up to the UI
