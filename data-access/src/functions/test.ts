import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function helloWorld1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('Http function was triggered.');
    return { body: 'Hello, world!' };
};

app.http('helloWorld1', {
    methods: ['GET', 'POST'],
    handler: helloWorld1
});