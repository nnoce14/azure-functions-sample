import { Model, Connection } from "mongoose";
import { IData, DataModelSchema } from "./data-model";

export class ModelLoader {
    public static loadModels(connection: Connection): { [key: string]: Model<any> } {
        const models: { [key: string]: Model<any> } = {};

        models['DataModel'] = connection.model<IData>('DataModel', DataModelSchema);
        // any other models go here
        // models['OtherModel'] = connection.model<IOther>('OtherModel', OtherModelSchema);

        return models;
    }
}