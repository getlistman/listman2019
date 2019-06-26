import { makeExecutableSchema } from 'graphql-tools'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()
const TAGS_CHANGED_TOPIC = 'tags_changed'
const tags = []

const typeDefs = [`
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
`];

const resolvers = {
  Query: {
    hello(root, args, context) {
      return "Hello world!";
    },
    tags(root, { type }, context) {
      return tags
    },
  },
  Mutation: {
    addTag: async (root, { type, label }, context) => {
      console.log(`adding ${type} tag '${label}'`);
      const newTag = {
        id: tags.length,
        label: label,
        type: type
      }
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

const jsSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default jsSchema;

let i = 0; 
setInterval(() => {
  i++;
  const newTag = {
    id: tags.length,
    label: 'new' + i,
    type: 'City'
  }
  pubsub.publish(TAGS_CHANGED_TOPIC, { tagAdded: newTag });
}, 20000);
