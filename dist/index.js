"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLUpload, graphqlUploadExpress, } = require('graphql-upload');
const helpers = require('./helpers');
const typeDefs = gql `
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
        singleUpload: (parent, { file }) => __awaiter(void 0, void 0, void 0, function* () {
            const { createReadStream } = yield file;
            const stream = createReadStream();
            const data = yield helpers.streamToString(stream);
            const parsedData = helpers.parseData(data);
            const biggestGrowthRateStock = helpers.getBiggestGrowthRateStock(JSON.parse(JSON.stringify(parsedData)));
            const smallestGrowthRateStock = helpers.getSmallestGrowthRateStock(JSON.parse(JSON.stringify(parsedData)));
            return { max: biggestGrowthRateStock, min: smallestGrowthRateStock };
        }),
    },
};
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            csrfPrevention: true,
        });
        yield server.start();
        const app = express();
        // This middleware should be added before calling `applyMiddleware`.
        app.use(graphqlUploadExpress());
        server.applyMiddleware({ app });
        yield new Promise(r => app.listen({ port: 4000 }, r));
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });
}
startServer();
