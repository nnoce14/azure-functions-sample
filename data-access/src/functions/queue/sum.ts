import { InvocationContext, app } from "@azure/functions";

export async function sumQueueHandler(queueItem: any, context: InvocationContext): Promise<void> {
    context.log('[SumQueueHandler] Queue Item - ', queueItem);
}

app.storageQueue('sum', {
  queueName: 'sum',
  connection: 'QUEUE_STORAGE_URL',
  handler: sumQueueHandler
})