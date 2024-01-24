import { createConnection, Connection, ConnectOptions, Model } from "mongoose";
import { DataModelSchema, IData } from "./models/data-model";
import { ModelLoader } from "./models/model-loader";

export class MongoConnection {
    static #connection: Connection;

    public static async getConnection(): Promise<Connection> {
        if (!this.#connection) {
            console.log('MongoDB Connection not found. Creating new connection...');
            const connectionString = process.env.MONGODB_URI2;
            console.log("creating a new DB connection")
            this.#connection = await createConnection(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                autoIndex: true
            } as ConnectOptions);

            

            ModelLoader.loadModels(this.#connection);
        }
         else if (this.#connection.readyState === 0) {
            console.log('MongoDB Connection found but disconnected. Reconnecting...');
            await this.#connection.openUri(process.env.MONGODB_URI2);
         }

        console.log("returning the singleton connection")
        return this.#connection;
    }

    static {
        console.log('MongoDB Connection initialized');
    }
}