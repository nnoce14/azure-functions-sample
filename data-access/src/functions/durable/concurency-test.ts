import * as df from "durable-functions";
import { DataModel } from "../../graphql/data-sources/cosmos-db";
import mongoose from "mongoose";
import { printConnectionInfo } from "../../infrastructure/utils/connection-info";

df.app.client.http("startUpdateDBConcurrentlyDemo", {
  route: "updateDBConcurrentlyDemo",
  handler: async (request, client, context) => {
    const instanceId = await client.startNew("updateDBConcurrentlyDemo");
    context.log(`Started orchestration with ID = '${instanceId}'.`);
    return client.createCheckStatusResponse(request, instanceId);
  },
});

df.app.orchestration("updateDBConcurrentlyDemo", function* (context) {
  const parallelTasks = [];

  // Get a list of N work items to process in parallel.
  for (let i = 0; i < 150; i++) {
    parallelTasks.push(context.df.callActivity("updateDBConcurrently", { taskId: i }));
  }

  yield context.df.Task.all(parallelTasks);

  console.log("update db concurrently complete");
  printConnectionInfo();
});

df.app.activity("updateDBConcurrently", {
  handler: async function ({ taskId }, context) {
    console.log(`Task ${taskId} updating ...`);
    printConnectionInfo();
    await DataModel.updateOne(
        {
          userId: "111",
        },
        {
          number1: taskId,
          number2: taskId,
          sum: taskId * 2,
          isDataUpdated: true,
        }
      )
      .then(() => {
        const conn = mongoose.connection;
        console.log(`Task ${taskId} completed`);
        printConnectionInfo();
        return taskId;
      });
  },
});
