import { Schema, model, Model, ObjectId } from 'mongoose';
import { Base, BaseOptions } from './core/base';

export interface IDataModel extends Base {
    number1: number;
    number2: number;
    sum: number;
    userId: string;
    isDataUpdated: boolean;

    id: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    schemaVersion: string;
}

export const DataModelSchema = new Schema<IDataModel, Model<IDataModel>, IDataModel>(
  {
    schemaVersion: { type: String, default: '1.0.0', required: false },
    number1: Number,
    number2: Number,
    sum: Number,
    userId: Number,
    isDataUpdated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  },
).index(
  { userId: 1 }, 
  { unique: true }
);

export const DataModel = model<IDataModel>('datamodels', DataModelSchema);