import { InvocationContext } from "@azure/functions";
import { DataModel, IDataModel } from "../cosmos-db/models/data-model";
import { printConnectionInfo } from "../utils/connection-info";

export async function updateDataModel(payload: any, sum: number, context: InvocationContext): Promise<void> {
    context.log(`[SumQueueHandler] Update Data Model - ${payload} - ${sum}`);

    const dataModelResult = await DataModel.updateOne(
        {
            userId: payload.userId,
        },
        {
            number1: payload.processedNumber1,
            number2: payload.processedNumber2,
            sum: sum,
            isDataUpdated: true,
        },
        {
            upsert: true,
        }
    );

    printConnectionInfo();

    context.log("[SumQueueHandler] Updated Data Model - ", dataModelResult);

    return;
}