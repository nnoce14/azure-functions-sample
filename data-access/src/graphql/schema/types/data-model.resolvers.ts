import { Context as ApolloContext } from "../../context";
import { DataModel, Resolvers } from "../../generated";

const dataModel: Resolvers = {
    Query: {
        dataModelByUserId: async (_, { userId }, context: ApolloContext) => {
            return (await context.dataSources.dataModelCosmosdbApi.getDataModelByUserId(userId)) as DataModel;
        }
    }
};

export default dataModel;