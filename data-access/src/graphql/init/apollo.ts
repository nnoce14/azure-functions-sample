import { ApolloServer, GraphQLRequestContext } from "@apollo/server";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import { Context as ApolloContext } from "../context";
import { PortalTokenValidation } from "./extensions/portal-token-validation";
import { connect } from "../../infrastructure/cosmos-db/connect";
import mongoose from "mongoose";
import { GraphQLSchema } from "graphql";
import { combinedSchema } from "./extensions/schema-builder";
import { wrapFunctionHandler } from "../wrapper";
export class ApolloServerRequestHandler {
  private readonly graphqlHandlerObj: ApolloServer<ApolloContext>;
  private portalTokenExtractor: PortalTokenValidation;

  public serverConfig(portalTokenExtractor: PortalTokenValidation, combinedSchema: GraphQLSchema) {
    return {
      schema: combinedSchema,
      cors: {
          origin: "*",
          credentials: true,
        },

      allowBatchedHttpRequests: true,
      //  playground: { endpoint: '/api/graphql/playground' },
      plugins: [
        {
          async requestDidStart(requestContext: GraphQLRequestContext<ApolloContext>) {
              return {
                async didEncounterErrors(requestContext: GraphQLRequestContext<ApolloContext>) {
                  console.error('Apollo Server encountered error:', requestContext.errors);
                },
              }  
          }
        },
        {
          async serverWillStart() {
            await connect();
            console.log("Apollo Server Starting");
            if (mongoose.connection.readyState === 1) {
              console.log("MongoDB Connected");
            }
          },
        },
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

      const server = new ApolloServer<ApolloContext>({
        ...this.serverConfig(this.portalTokenExtractor, combinedSchema),
      });

      this.graphqlHandlerObj = server;
    } catch (error) {
      console.log("Error initializing apollo server:", error);
    }
  }
}

export {
  wrapFunctionHandler
}