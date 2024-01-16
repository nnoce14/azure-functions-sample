import { app, HttpRequest, InvocationContext, output } from '@azure/functions';
import { Counter } from '../../counter';

interface SampleDataType {
  userId: number;
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
  handler: async (request: HttpRequest, context: InvocationContext) => {
    context.log("HTTP function processed request for url %s", request.url);
    const data = (await request.json()) as SampleDataType;
    console.log(data.number1);
    console.log(data.number2);
    const processedNumber1 = data.number1 * 3;
    const processedNumber2 = data.number2 * 3;
    const userId = data.userId;

    let counter = Counter.getInstance();
    counter.increment();
    context.log("[ProcessNumbers] Counter - ", counter.count);

    const result = JSON.stringify({
      processedNumber1,
      processedNumber2,
      userId
    });

    context.extraOutputs.set(queueOutput, result); // send result to queue

    return {
      status: 200,
      body: JSON.stringify(result),
    };
  },
});
