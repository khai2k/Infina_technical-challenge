const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const {
  GraphQLUpload,
  graphqlUploadExpress,
} = require('graphql-upload');
const helpers= require('./helpers');

const typeDefs = gql`
  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  type StockResponse {
    code: String!
    growth:Float!
  }
  type Response {
    max:StockResponse!,
    min:StockResponse!
}
  type Query {
    # This is only here to satisfy the requirement that at least one
    # field be present within the 'Query' type.  This example does not
    # demonstrate how to fetch uploads back.
    otherFields: Boolean!
  }

  type Mutation {
    # Multiple uploads are supported. See graphql-upload docs for details.
    singleUpload(file: Upload!): Response!
  }
`;

const resolvers = {
  Upload: GraphQLUpload,

  Mutation: {
    singleUpload: async (parent :any, { file }:any) => {
      const { createReadStream } = await file;
      const stream = createReadStream();

    const data = await helpers.streamToString(stream)
    const parsedData = helpers.parseData(data);

    const biggestGrowthRateStock=  helpers.getBiggestGrowthRateStock(JSON.parse(JSON.stringify(parsedData)));

    const smallestGrowthRateStock=  helpers.getSmallestGrowthRateStock(JSON.parse(JSON.stringify(parsedData)));
    return { max: biggestGrowthRateStock, min: smallestGrowthRateStock };
    },
  },
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
  });
  await server.start();

  const app = express();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  await new Promise<void>(r => app.listen({ port: 4000 }, r));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();