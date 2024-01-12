import { Model, Connection } from "mongoose";
import { IData, DataModelSchema } from "./data-model";

export class ModelLoader {
    static #models: { [key: string]: Model<any> } = {};
    public static loadModels(connection: Connection): void {
        this.#models["DataModel"] = connection.model<IData>('DataModel', DataModelSchema);  
        // any other models go here
        // this.#models['OtherModel'] = connection.model<IOther>('OtherModel', OtherModelSchema);
    }

    public static getModel<T>(modelName: string): Model<T> {
        return this.#models[modelName] as Model<T>;
    }
}