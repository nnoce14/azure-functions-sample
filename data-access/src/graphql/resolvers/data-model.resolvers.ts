import { Context as ApolloContext } from "../context";

export const DataModelResolvers = {
    Query: {
        getDataModelByUserId: async (parent: any, args: any, context: ApolloContext, info: any) => {
            return await context.dataSources.dataModelCosmosdbApi.getDataModelByUserId(args.userId);
        }
    }
};