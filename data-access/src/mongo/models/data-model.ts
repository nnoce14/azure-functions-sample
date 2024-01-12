import { Schema, Document, createConnection, ConnectOptions, model, set } from 'mongoose';

export interface IData extends Document {
    id: string;
    number1: number;
    number2: number;
    sum: number;
    userId: number;
}

export const DataModelSchema = new Schema({
  id: Schema.Types.ObjectId,
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
});

DataModelSchema.set('toJSON', {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
}); 

export const DataModel = model<IData>('DataModel', DataModelSchema);