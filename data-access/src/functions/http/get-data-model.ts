import { HttpRequest, HttpResponseInit, InvocationContext, app } from "@azure/functions";
import { Counter } from "../../counter";
import { DataModel } from "../../graphql/data-sources/cosmos-db";
import { printConnectionInfo } from "../../infrastructure/utils/connection-info";

interface DataType {
  userId: number;
}

// get a record from the database
export async function getDataModel(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("HTTP function processed request for url %s", request.url);
  const userId = request.query.get("userId");
  console.log("userId", userId);

  const dataModelResult = await DataModel.findOne({
    userId: userId,
  });
  printConnectionInfo();
  console.log("dataModelResult", dataModelResult);

  let counter = Counter.getInstance();

  if (dataModelResult !== null) {
    return {
      status: 200,
      body: JSON.stringify({
        sum: dataModelResult.sum ?? null,
        count: counter.count,
        isDataUpdated: dataModelResult.isDataUpdated,
      }),
    };
  }

  return {
    status: 404,
    body: JSON.stringify({
      sum: null,
      count: counter.count,
    }),
  };
}

app.http("getData", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "http/get-data",
  handler: getDataModel,
});
