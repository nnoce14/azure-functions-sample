import { Schema, model, Model } from 'mongoose';
import { Base } from './core/base';

export interface IDataModel extends Base {
    id: string;
    number1: number;
    number2: number;
    sum: number;
    userId: number;
    isDataUpdated: boolean;
}

export const DataModelSchema = new Schema<IDataModel, Model<IDataModel>, IDataModel>(
  {
    id: Schema.Types.ObjectId,
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
    timestamps: true
  },
).index(
  { userId: 1 }, 
  { unique: true }
);

DataModelSchema.set('toJSON', {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
}); 

export const DataModel = model<IDataModel>('datamodels', DataModelSchema);