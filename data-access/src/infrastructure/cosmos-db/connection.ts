import { createConnection, Connection, ConnectOptions } from "mongoose";
import { ModelLoader } from "./models/model-loader";

export class MongoConnection {
    static #connection: Connection;

    public static initialize(conn: Connection): void {
        this.#connection = conn;
        ModelLoader.loadModels(this.#connection);
    }

    public static async getConnection(): Promise<Connection> {
        if (!this.#connection || (this.#connection.readyState !== 1 && this.#connection.readyState !== 2)) {
            console.log('MongoDB Connection not found. Creating new connection...');
            const connectionString = process.env.COSMOSDB_URL;
            console.log("creating a new DB connection")
            this.#connection = createConnection(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                autoIndex: true
            } as ConnectOptions);

            ModelLoader.loadModels(this.#connection);
        }

        console.log("returning the singleton connection")
        return this.#connection;
    }

    // static {
    //     console.log('MongoDB Connection initialized');
    // }
}