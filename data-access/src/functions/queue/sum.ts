import { app } from "@azure/functions";
import { sumQueueHandler } from "../../infrastructure/queue-receivers/sum.queue-receiver";

app.storageQueue("sum", {
  queueName: "sum",
  connection: "QUEUE_STORAGE_URL",
  handler: sumQueueHandler,
});
