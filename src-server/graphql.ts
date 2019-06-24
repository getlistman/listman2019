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

  type TagsPage {
    tags: [Tag]
    hasMore: Boolean
  }

  type Query {
    hello: String
    ping(message: String!): String
    tags(type: String!): [Tag]
    tagsPage(page: Int!, size: Int!): TagsPage
    randomTag: Tag
    lastTag: Tag
    tagAdded(type: String!): Tag
  }

  type Mutation {
    addTag(type: String!, label: String!): Tag
  }

  type Subscription {
    tagAdded(type: String!): Tag
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const resolvers = {
  Query: {
    hello(root, args, context) {
      return "Hello world!";
    },
    ping(root, { message }, context) {
      return `Answering ${message}`;
    },
    tags(root, { type }, context) {
      return [
        {
          id: 1,
          label: 'foo',
          type: 'bar'
        }
      ]
    },
    tagsPage(root, { page, size }, context) {
      return Tags.getTagsPage(page, size);
    },
    randomTag(root, args, context) {
      return Tags.getRandomTag();
    },
    lastTag(root, args, context) {
      return Tags.getLastTag();
    },
    tagAdded(root, args, context) {
      const result = pubsub.asyncIterator(TAGS_CHANGED_TOPIC);
      console.log('Query tagAdded');
      console.dir(result);
      return result
    }
  },
  Mutation: {
    addTag: async (root, { type, label }, context) => {
      console.log(`adding ${type} tag '${label}'`);
      const newTag = await Tags.addTag(type, label);
      pubsub.publish(TAGS_CHANGED_TOPIC, { tagAdded: newTag });
      return newTag;
    },
  },
  Subscription: {
    tagAdded: {
      subscribe: () => {
        console.log('pubsub')
        return pubsub.asyncIterator(TAGS_CHANGED_TOPIC)
      }
    }
  },
};

/*
let i = 1; 
setInterval(() => {
  console.log('timeout' + i);
  i++;
  pubsub.publish(TAGS_CHANGED_TOPIC, {
    tagAdded: {
      id: i,
      label: 'ADDDD',
      type: 'TTTTT'
    }
  })
}, 10000);
*/

const server = new ApolloServer({
  typeDefs,
  resolvers,
  //subscriptions: '/gql'
});

// https://www.apollographql.com/docs/apollo-server/features/subscriptions/
const http = require('http');
const httpServer = http.createServer((req, res) => {
  console.dir(req);
});
//server.installSubscriptionHandlers(httpServer);

exports.handler = server.createHandler();
