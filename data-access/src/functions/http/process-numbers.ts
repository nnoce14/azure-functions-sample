import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';

interface SampleDataType {
  number1: number;
  number2: number;
}

const queueOutput = output.storageQueue({
  queueName: 'sum',
  connection: "QUEUE_STORAGE_URL", // dont need to use process.env.QUEUE_STORAGE_URL
});


app.http("processNumbers", {
  methods: ["POST"],
  extraOutputs: [queueOutput],
  authLevel: "anonymous",
  route: "http/process-numbers",
  handler: async (request, context) => {
    context.log("HTTP function processed request for url %s", request.url);
    const data = (await request.json()) as SampleDataType;
    console.log(data.number1);
    console.log(data.number2);
    const processedNumber1 = data.number1 * 3;
    const processedNumber2 = data.number2 * 3;

    const result = JSON.stringify({
      processedNumber1,
      processedNumber2,
    });

    context.extraOutputs.set(queueOutput, result);

    return {
      status: 200,
      body: JSON.stringify(result),
    };
  },
});
