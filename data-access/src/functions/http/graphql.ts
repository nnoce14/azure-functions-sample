import { app } from "@azure/functions";
import { ApolloServerRequestHandler } from "../../graphql/init/apollo";
import { startServerAndCreateHandler } from "../../graphql/init/func-v4";
import { Context as ApolloContext } from "../../graphql/context";

let apolloServerRequestHandler = new ApolloServerRequestHandler(
    new Map<string, string>([
        ["AccountPortal", "ACCOUNT_PORTAL"]
    ])
);

app.http("graphql", {
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS", "HEAD"],
    route: "graphql/{*segments}",
    handler: startServerAndCreateHandler<ApolloContext>(apolloServerRequestHandler.getServer(), {
        context: async ({ req }) => {
            let context = new ApolloContext();
            context.init(req, apolloServerRequestHandler);
            return context;
        }
    }),
});