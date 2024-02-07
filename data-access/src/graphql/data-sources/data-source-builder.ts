import { Context } from "../context";
import { DataModel, DataModelCosmosdbApi } from "./cosmos-db";

export class DataSourceBuilder {
    dataModelCosmosdbApi: DataModelCosmosdbApi;

    constructor(context: Context) {
        this.dataModelCosmosdbApi = new DataModelCosmosdbApi({ modelOrCollection: DataModel, context });
    }
}