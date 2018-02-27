const Chance = require("chance");
const getDb = require("./db.js");
const _ = require("lodash");

const {
    connectionFromArray,
    fromGlobalId,
    toGlobalId
} = require("graphql-relay");

const { getMockedResolvers } = require('mock-relay-server');

const { makeExecutableSchema } = require("graphql-tools");

const SchemaDefinition = `
  interface Node {
      # The id of the object.
      id: ID!
  }

  type Viewer {
      user : User
  }

  type Query {
      node(id: ID): Node
      viewer(userId: ID): Viewer
  }

  type Mutation {
      addWidget(input: AddWidgetInput): Widget
      updateWidget(input: UpdateWidgetInput): Widget
      deleteWidget(input: DeleteWidgetInput): Widget
  }

  input DeleteWidgetInput {
    id: ID!
  }

  input UpdateWidgetInput {
      cost: Int
      name: String
      id: ID!
      clientMutationId: String!
  }

  input AddWidgetInput {
      cost: Int!
      name: String!
      clientMutationId: String
  }

  type AddWidgetPayload {
      widgetEdge: WidgetEdge

  }

  type PageInfo {
    # When paginating forwards, are there more items?
    hasNextPage: Boolean!

    # When paginating backwards, are there more items?
    hasPreviousPage: Boolean!

    # When paginating backwards, the cursor to continue.
    startCursor: String

    # When paginating forwards, the cursor to continue.
    endCursor: String
  }

  schema {
      query: Query
      mutation: Mutation
  }
  type User implements Node {
      id: ID!
      name: String!
      company: Company
      clientMutationId: String
  }
  type Widget implements Node {
      id: ID!
      name: String!
      cost: Int!
      clientMutationId: String
  }
  type WidgetConnection {
      totalResults: Int!
      pageInfo: PageInfo!
      edges: [WidgetEdge]
  }

  type WidgetEdge {
      node: Widget
      cursor: String!
  }

  type Company implements Node {
      id: ID!
      name: String!
      averageCost: Int!
      widgetList(
          first: Int,
          before: String,
          after: String,
          last: Int,
          offset: Int
      ): WidgetConnection
      clientMutationId: String
  }
`;


const dbChance = new Chance("test");
const generateNItems = (n, getItem) => {
    return dbChance
        .n(dbChance.guid, n)
        .map(id => {
            const subChance = new Chance(id);
            const item = getItem(subChance);
            return Object.assign(
                {
                    id,
                },
                item
            );
        })
};

const widgets = generateNItems(20, chance => ({
    name: chance.sentence({ words: 3 }),
    cost: chance.integer({ min: 5, max: 5000 })
}));

const companies = [
  {
      id: "1",
      name: "ACME Corporation",
      averageCost: 500
  }
]

const users = [
  {
    id: "1",
    name: "Clay Branch",
    company_id: "1",
  }
]

const resolvers = getMockedResolvers({
    Query: {
        resolver: connections => ({
            viewer: async (query, { userId }) => {
                const user = await connections.User.getNode(userId)
                return { user }
            },
        }),
    },
    Widget: {
        data: widgets,
    },
    Company: {
        data: companies,
        resolver: connections => ({
            widgetList: connections.Widget.paginate,
        }),
    },
    User: {
        data: users,
        resolver: connections => ({
            company: user => connections.Company.getNode(user.company_id),
        }),
    },
    Mutation: {
      resolver: connections => ({
          updateWidget: connections.Widget.update,
          addWidget: connections.Widget.create,
          deleteWidget: connections.Widget.delete,
      }),
    },
})

module.exports = makeExecutableSchema({
    typeDefs: [SchemaDefinition],
    resolvers
});
