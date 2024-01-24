import mongoose from 'mongoose';
import { MongoConnection } from './connection';

export const disconnect = async () => {
  await mongoose.connection.close();
};

export const connect = async () => {
  mongoose.connection.on('open', () => {
    // console.log('open'); // commenting this to prevent console spam
  });

  mongoose.connection.on('close', () => {
    console.log('[Mongoose] close');
  });

  mongoose.connection.on('disconnected', () => {
    console.log('[Mongoose] disconnected');
  });

  mongoose.connection.on('connected', () => {
    console.log('[Mongoose] connected');
  });

  mongoose.connection.on('connecting', () => {
    console.log('[Mongoose] connecting');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[Mongoose] reconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[Mongoose] error', err);
  });

  mongoose.connection.on('fullsetup', () => {
    console.log('[Mongoose] fullsetup');
  });

  mongoose.connection.on('all', () => {
    console.log('[Mongoose] all');
  });

  mongoose.connection.on('reconnectFailed', (err) => {
    console.error('[Mongoose] reconnectFailed', err);
  });
  /*
  setInterval(() => {
      console.log(mongoose.connection.readyState)
  }, 2000);
  */

  //mongoose.set('useCreateIndex', true); //Prevents deprecation warning
  if (!process.env.COSMOSDB_URL || process.env.COSMOSDB_URL.length === 0) throw new Error('CosmosDB connection string not found.');
  if (!process.env.COSMOSDB_DBNAME || process.env.COSMOSDB_DBNAME.length === 0) throw new Error('CosmosDB name not found.');

  let connectionString: string;
  if (process.env.NODE_ENV === 'test') {
    // connectionString = `${process.env.COSMOSDB_URL}/admin?ssl=true&retrywrites=false`;
    connectionString = `${process.env.COSMOSDB_URL}&retrywrites=false`;
    console.log('[Mongoose] Connecting to CosmosDB in test mode');
  } else {
    // connectionString =`${process.env.COSMOSDB_URL}/?ssl=true&replicaSet=globaldb&retrywrites=false&appName=@sharethrift@`;
    connectionString = `${process.env.COSMOSDB_URL}`;
    console.log('[Mongoose] Connecting to CosmosDB in Dev / Prod Mode');
  }

  try {
    await mongoose
      .connect(connectionString, {
        //  useNewUrlParser: true,
        //  useUnifiedTopology: true,
        //  useFindAndModify: false,
        useUnifiedTopology: true,
        tlsInsecure: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test', //only true for local developent - required for Azure Cosmos DB emulator
        dbName: process.env.COSMOSDB_DBNAME,
        // keepAlive: true,
        // keepAliveInitialDelay: 300000,
        autoIndex: true, //Enables automatic index creation for all schemas.
        autoCreate: true, //Enables automatic collection creation for all models.
        minPoolSize: 10, //believe the default is 0 - having something higher than 0 helps with performance
        maxPoolSize: 100, // default is 100
        serverSelectionTimeoutMS: 300000,
        //   poolSize: Number(process.env.COSMOSDB_POOL_SIZE)
      } as mongoose.ConnectOptions)
      .then(() => {
        MongoConnection.initialize(mongoose.connection);
        console.log(`🗄️ Successfully connected Mongoose to ${mongoose.connection.name} 🗄️`)
      });

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      mongoose.set('debug', { shell: true });
    }
  } catch (error) {
    console.log(`🔥 An error ocurred when trying to connect Mongoose with ${mongoose.connection.name} 🔥`);
    throw error;
  }
};
