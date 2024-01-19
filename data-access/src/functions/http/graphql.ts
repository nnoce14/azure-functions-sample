import { HttpHandler, app } from "@azure/functions";
import { server } from "../../graphql/init/apollo";
import { startServerAndCreateHandler } from "../../graphql/init/func-v4";

app.http("graphql", {
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS", "HEAD"],
    route: "graphql/{*segments}",
    handler: startServerAndCreateHandler(server),
});