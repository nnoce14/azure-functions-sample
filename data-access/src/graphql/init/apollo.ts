import { ApolloServer } from '@apollo/server';
import { DataModelTypeDefs } from '../schema/data-model';
import { DataModelResolvers } from '../resolvers/data-model.resolvers';

export const server = new ApolloServer({
    typeDefs: DataModelTypeDefs,
    resolvers: DataModelResolvers,
});
