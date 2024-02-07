import { Document, SchemaOptions } from "mongoose";

export interface MongoBase {
  id?: any;
  schemaVersion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Base extends Document,MongoBase  {
}

export const BaseOptions : SchemaOptions = {
  timestamps: true, 
  versionKey: 'version', 
}

  
