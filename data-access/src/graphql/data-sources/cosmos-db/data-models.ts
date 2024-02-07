import { IDataModel } from "../../../infrastructure/cosmos-db/models/data-model";
import { Context } from "../../context";
import { CosmosDataSource } from "./cosmos-data-source";

export class DataModels extends CosmosDataSource<IDataModel, Context> {

    async getDataModels(): Promise<IDataModel[]> {
        return await this.model.find();
    }

    async getDataModelByUserId(userId: string): Promise<IDataModel> {
        return await this.model.findOne({ userId });
    }
}