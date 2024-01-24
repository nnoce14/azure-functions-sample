import { createConnection, Connection, ConnectOptions } from "mongoose";
import { ModelLoader } from "./models/model-loader";

export class MongoConnection {
    static #connection: Connection;

    public static initialize(conn: Connection): void {
        this.#connection = conn;
        ModelLoader.loadModels(this.#connection);
    }

    public static async getConnection(): Promise<Connection> {
        const connectionString = process.env.COSMOSDB_URL;
        if (!this.#connection) {
            console.log('MongoDB Connection not found. Creating new connection...');
            console.log("creating a new DB connection")
            this.#connection = createConnection(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                autoIndex: true
            } as ConnectOptions);

            ModelLoader.loadModels(this.#connection);
        }
         else if (this.#connection.readyState === 0) {
            console.log('MongoDB Connection found but disconnected. Reconnecting...');
            await this.#connection.openUri(connectionString);
         }

        console.log("returning the singleton connection")
        return this.#connection;
    }

    // static {
    //     console.log('MongoDB Connection initialized');
    // }
}