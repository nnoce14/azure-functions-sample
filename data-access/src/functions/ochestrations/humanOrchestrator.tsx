const { output } = require("@azure/functions");
const df = require("durable-functions");
const { DateTime } = require("luxon");

const approvalActivityName = "approveRequest";
const processApprovalActivityName = "processApproval";
const escalateActivityName = "escalate";

// Not working yet
df.app.orchestration("requestApproval", function* (context) {
    const phoneNumber = context.df.getInput();
    if (!phoneNumber) {
        throw new Error("A phone number input is required.");
    }

    let approved = false

    const expiration = DateTime.fromJSDate(context.df.currentUtcDateTime).plus({ hours: 72 });
    
    const timeoutTask = context.df.createTimer(expiration.toJSDate());
    const approvalEventTask = context.df.waitForExternalEvent("ApprovalEvent");


    const winningEvent = yield context.df.Task.any([approvalEventTask, timeoutTask]);

    if (winningEvent === approvalEventTask) {
      timeoutTask.cancel();

      approved = !!approvalEventTask.result 

      yield context.df.callActivity(processApprovalActivityName, approvalEventTask.result);
    } else {
      yield context.df.callActivity(escalateActivityName);
    }
  
    if (!timeoutTask.isCompleted) {
        timeoutTask.cancel();
    }

    console.log(`Approved: ${approved}`)
    return approved;
});



df.app.activity(approvalActivityName, {
    handler: function (phoneNumber, context) {

        context.log(`Approving`);

        return true;
    },
});

// import * as df from "durable-functions";
// import { DateTime } from "luxon";
// import {
//   OrchestrationHandler,
//   OrchestrationContext,
// } from "durable-functions";

// const { app } = require("@azure/functions");


// df.app.client.http("submitRequestApproval", {
//   route: "orchestrators/{orchestratorName}",
//   handler: async (request, client, context) => {
//     const body = await request.json();
//     const instanceId = await client.startNew(request.params.orchestratorName, {
//       input: body,
//     });

//     context.log(`Started orchestration with ID = '${instanceId}'.`);

//     return client.createCheckStatusResponse(request, instanceId);
//   },
// });


// const orchestratorFunction: OrchestrationHandler = function* (context: OrchestrationContext): Generator<any, any, any> {
//   yield context.df.callActivity("RequestApproval");


//   const dueTime = DateTime.fromJSDate(context.df.currentUtcDateTime).plus({ hours: 72 });
//   const durableTimeout = context.df.createTimer(dueTime.toJSDate());
  
//   const approvalEvent = context.df.waitForExternalEvent("ApprovalEvent");
  
//   const winningEvent = yield context.df.Task.any([approvalEvent, durableTimeout]);

//   if (winningEvent === approvalEvent) {
//     durableTimeout.cancel();
//     yield context.df.callActivity("ProcessApproval", approvalEvent.result);
//   } else {
//     yield context.df.callActivity("Escalate");
//   }
// };


// df.app.activity("RequestApproval", {
//   handler: async function (rootDirectory, context) {
//     return true
//   },
// });

// df.app.activity("ProcessApproval", {
//   handler: async function (rootDirectory, context) {
//     return true
//   },
// });

// df.app.activity("Escalate", {
//   handler: async function (rootDirectory, context) {
//     return 
//   },
// });


// // app.get("raiseEventToOrchestration", async function (request, context) {
// //     const instanceId = await request.text();
// //     const client = df.getClient(context);
// //     const isApproved = true;
// //     await client.raiseEvent(instanceId, "ApprovalEvent", isApproved);
// // });

// export default orchestratorFunction;




