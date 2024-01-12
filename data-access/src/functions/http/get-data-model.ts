import { HttpRequest, HttpResponseInit, InvocationContext, app } from "@azure/functions";
import { MongoConnection } from "../../mongo/connection";
import { Counter } from "../../counter";

interface DataType {
    userId: number;
}

export async function getDataModel(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log("HTTP function processed request for url %s", request.url);
    const data = (await request.json()) as DataType;

    const connection = await MongoConnection.getConnection();
    const dataModelResult = await connection.model("DataModel").findOne({
        userId: data.userId,
    });

    let counter = Counter.getInstance();

    if (dataModelResult) {
        return {
            status: 200,
            body: JSON.stringify({
                sum: dataModelResult.sum ?? undefined,
                count: counter.count,
                isDataUpdated: dataModelResult.isDataUpdated
            })
        };
    }

    return {
        status: 204,
        body: JSON.stringify({
            sum: undefined,
            count: counter.count
        })
    };
}

app.http("getData", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "http/get-data",
    handler: getDataModel
});