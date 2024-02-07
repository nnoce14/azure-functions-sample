import { HttpRequest, InvocationContext } from "@azure/functions";
import { ApolloServerRequestHandler } from "./init/apollo";
import { DataSourceBuilder } from "./data-sources/data-source-builder";

export class Context extends InvocationContext {
    public dataSources: DataSourceBuilder;

    public init(request: HttpRequest, serverRequestHandler: ApolloServerRequestHandler) {
        this.dataSources = new DataSourceBuilder(this);

        request.headers['x-ms-privatelink-id'] = ''; // https://github.com/Azure/azure-functions-host/issues/6013
        request.headers['server'] = null; //hide microsoft server header

        this.log('Context initialized');
    }
}