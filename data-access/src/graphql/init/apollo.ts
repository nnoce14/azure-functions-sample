import { ApolloServer, GraphQLRequestContext } from "@apollo/server";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import { DataModelTypeDefs } from "../schema/data-model";
import { DataModelResolvers } from "../resolvers/data-model.resolvers";
import { Context as ApolloContext } from "../context";
import { PortalTokenValidation } from "./extensions/portal-token-validation";
import { connect } from "../../infrastructure/cosmos-db/connect";
export class ApolloServerRequestHandler {
  private readonly graphqlHandlerObj: ApolloServer<ApolloContext>;
  private portalTokenExtractor: PortalTokenValidation;

  public serverConfig(typeDefs: any, resolvers: any) {
    return {
      typeDefs: DataModelTypeDefs,
      resolvers: DataModelResolvers,
      // cors: {
      //     origin: "*",
      //     credentials: true,
      //   },

      allowBatchedHttpRequests: true,
      //  playground: { endpoint: '/api/graphql/playground' },
      plugins: [
        // {
        //   async didEncounterErrors(requestContext: GraphQLRequestContext<ApolloContext>) {
        //     console.error('Apollo Server encountered error:', requestContext.errors);
        //   },
        // },
        {
          async serverWillStart() {
            await connect();
            console.log("Apollo Server Starting");
          },
        },
        // {
        //   async onHealthCheck(): Promise<any> {
        //         // health check endpoint is: https://<function-name>.azurewebsites.net/api/graphql/.well-known/apollo/server-health
        //         // doesn't work yet
        //         // https://github.com/apollographql/apollo-server/pull/5270
        //         // https://github.com/apollographql/apollo-server/pull/5003
        //         let mongoConnected = mongoose.connection.readyState === 1;
        //         if (mongoConnected) {
        //         return;
        //         } else {
        //         throw new Error('MongoDB is not connected');
        //         }
        //     }
        // },
        responseCachePlugin(),
      ],
    };
  }

  public getServer() {
    return this.graphqlHandlerObj;
  }

  constructor(portals: Map<string, string>) {
    try {
      console.log(" -=-=-=-=-=-=-=-=-= INITIALIZING APOLLO -=-=-=-=-=-=-=-=-=");
      //   const securedSchema: GraphQLSchemaWithFragmentReplacements = applyMiddleware(combinedSchema, permissions);
      this.portalTokenExtractor = new PortalTokenValidation(portals);

      const typeDefs = DataModelTypeDefs;
      const resolvers = DataModelResolvers;

      const server = new ApolloServer<ApolloContext>({
        ...this.serverConfig(typeDefs, resolvers),
      });

      this.graphqlHandlerObj = server;
    } catch (error) {
      console.log("Error initializing apollo server:", error);
    }
  }
}