import { ConnectOptions } from "mongoose";
import * as df from "durable-functions";
import { MongoConnection } from "../../mongo/connection";

df.app.client.http("startUpdateDBConcurrentlyDemo", {
  route: "updateDBConcurrentlyDemo",
  handler: async (request, client, context) => {
    await MongoConnection.getConnection(); // initialize the connection
    const instanceId = await client.startNew("updateDBConcurrentlyDemo");
    context.log(`Started orchestration with ID = '${instanceId}'.`);
    return client.createCheckStatusResponse(request, instanceId);
  },
});

df.app.orchestration("updateDBConcurrentlyDemo", function* (context) {
  const parallelTasks = [];

  // Get a list of N work items to process in parallel.
  for (let i = 0; i < 500; i++) {
    parallelTasks.push(context.df.callActivity("updateDBConcurrently", { taskId: i }));
  }

  yield context.df.Task.all(parallelTasks);

  console.log("update db concurrently complete");

  MongoConnection.getConnection().then((connection) => {
    connection.watch()
    console.log("database closed");
  });
});

df.app.activity("updateDBConcurrently", {
  handler: async function ({ taskId }, context) {
    console.log(`Task ${taskId} updating ...`);
    const connection = await MongoConnection.getConnection();
    await connection
      .model("DataModel")
      .updateOne(
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
        console.log(`Task ${taskId} completed`);
        return taskId;
      });
  },
});
