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
      subscribe: () => pubsub.asyncIterator(TAGS_CHANGED_TOPIC)
    }
  },
};

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
}, 5000);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler();
