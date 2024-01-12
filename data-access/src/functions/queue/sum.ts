import { InvocationContext, app } from "@azure/functions";

export async function sumQueueHandler(queueItem: any, context: InvocationContext): Promise<void> {
  context.log("[SumQueueHandler] Queue Item - ", queueItem);

  const data = JSON.parse(JSON.stringify(queueItem));
  console.log("data", data);
  const sum = data.processedNumber1 + data.processedNumber2;
  context.log("[SumQueueHandler] Sum - ", sum);
  return;
}

app.storageQueue("sum", {
  queueName: "sum",
  connection: "QUEUE_STORAGE_URL",
  handler: sumQueueHandler,
});
