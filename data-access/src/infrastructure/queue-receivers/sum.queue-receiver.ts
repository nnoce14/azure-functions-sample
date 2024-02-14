import { InvocationContext } from "@azure/functions";
import { updateDataModel } from "./sum-update-datamodel";
import { Counter } from "../../counter";

export async function sumQueueHandler(queueItem: any, context: InvocationContext): Promise<void> {
    context.log("[SumQueueHandler] Queue Item - ", queueItem);

    const data = JSON.parse(JSON.stringify(queueItem));
    console.log("data", data);
    const sum = data.processedNumber1 + data.processedNumber2;
    context.log("[SumQueueHandler] Sum - ", sum);

    await updateDataModel(data, sum, context);

    let counter = Counter.getInstance();
    counter.increment();
    context.log("[SumQueueHandler] Counter - ", counter.count);

    return;
}