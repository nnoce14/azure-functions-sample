export const DataModelTypeDefs = `#graphql
 
  type DataModel {
    _id: String!
    userId: String!
    isDataUpdated: Boolean!
    number1: Int
    number2: Int
    sum: Int
  }

  type Query {
    getDataModelByUserId(userId: String!): DataModel
  }
  
`;