const { ApolloServer } = require('./apollo-server-lambda-websocket');
const { gql } = require('apollo-server-lambda');
//const { ApolloServer, gql } = require('apollo-server-lambda');

import { PubSub, withFilter } from 'graphql-subscriptions';
const pubsub = new PubSub();
const TAGS_CHANGED_TOPIC = 'tags_changed'


const typeDefs = gql`
  type Tag {
    id: Int
    label: String
    type: String
  }

  type Query {
    hello: String
    tags(type: String!): [Tag]
  }

  type Subscription {
    tagAdded(type: String!): Tag
  }

  schema {
    query: Query
    subscription: Subscription
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    tags(root, { type }, context) {
      return [
        {
          "id": 1,
          "label": 'tokyo',
          "type": 'City'
        }
      ];
    },
  },
  Subscription: {
    tagAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(TAGS_CHANGED_TOPIC),
        (payload, variables) => payload.tagAdded.type === variables.type,
      ),
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler();
