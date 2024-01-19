import { MongoConnection } from "../../mongo/connection";

export const DataModelResolvers = {
    Query: {
        getDataModelByUserId: async (parent: any, args: any, context: any, info: any) => {
            const { userId } = args;
            const connection = await MongoConnection.getConnection();
            const dataModel = await connection.model("DataModel").findOne({ userId });
            return dataModel;
        }
    }
};