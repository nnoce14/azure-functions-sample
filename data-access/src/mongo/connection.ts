import { createConnection, Connection, ConnectOptions, Model } from "mongoose";
import { DataModelSchema, IData } from "./models/data-model";
import { ModelLoader } from "./models/model-loader";

export class MongoConnection {
    static #connection: Connection;

    public static async getConnection(): Promise<Connection> {
        if (!this.#connection || (this.#connection.readyState !== 1 && this.#connection.readyState !== 2)) {
            console.log('MongoDB Connection not found. Creating new connection...');
            const connectionString = process.env.MONGODB_URI;

            this.#connection = await createConnection(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                autoIndex: true
            } as ConnectOptions);

            ModelLoader.loadModels(this.#connection);
        }

        return this.#connection;
    }

    static {
        console.log('MongoDB Connection initialized');
    }
}