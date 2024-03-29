import { InvocationContext, app } from "@azure/functions";
import { Counter } from "../../counter";
import { DataModel } from "../../graphql/data-sources/cosmos-db";

export async function sumQueueHandler(queueItem: any, context: InvocationContext): Promise<void> {
  context.log("[SumQueueHandler] Queue Item - ", queueItem);

  const data = JSON.parse(JSON.stringify(queueItem));
  console.log("data", data);
  const sum = data.processedNumber1 + data.processedNumber2;
  context.log("[SumQueueHandler] Sum - ", sum);

  const dataModelResult = await DataModel.updateOne(
    {
      userId: data.userId,
    },
    {
      number1: data.processedNumber1,
      number2: data.processedNumber2,
      sum: sum,
      isDataUpdated: true,
    },
    {
      upsert: true,
    }
  );

  context.log("[SumQueueHandler] Created Data Model - ", dataModelResult);

  let counter = Counter.getInstance();
  counter.increment();
  context.log("[SumQueueHandler] Counter - ", counter.count);

  return;
}

app.storageQueue("sum", {
  queueName: "sum",
  connection: "QUEUE_STORAGE_URL",
  handler: sumQueueHandler,
});
