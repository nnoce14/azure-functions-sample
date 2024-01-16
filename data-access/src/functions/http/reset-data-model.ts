import { HttpRequest, HttpResponseInit, InvocationContext, app } from "@azure/functions";
import { MongoConnection } from "../../mongo/connection";

interface ResetDataType {
    userId: number;
}

export async function resetData(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log("HTTP function processed request for url %s", request.url);
    const { userId } = (await request.json()) as ResetDataType;

    const connection = await MongoConnection.getConnection();
    const dataModelResult = await connection.model("DataModel").updateOne(
        {
            userId: userId,
        },
        { $unset: {
            number1: 1,
            number2: 1,
            sum: 1,
          }
        },
        {
          $set: {
            isDataUpdated: true,
          }
        }
    );

    console.log("dataModelResult", dataModelResult);
    if (!dataModelResult) {
        return {
            status: 400
        }
    }

    return {
        status: 200
    }
}

app.http("resetData", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "http/reset-data",
    handler: resetData,
});