export default `
input AddWidgetInput {
  cost: Int!
  name: String!
  clientMutationId: String
}

type AddWidgetPayload {
  widgetEdge: WidgetEdge
}

type Company implements Node {
  id: ID!
  name: String!
  averageCost: Int!
  widgetList(first: Int, before: String, after: String, last: Int, offset: Int): WidgetConnection
  clientMutationId: String
}

input DeleteWidgetInput {
  id: ID!
}

type Mutation {
  addWidget(input: AddWidgetInput): Widget
  updateWidget(input: UpdateWidgetInput): Widget
  deleteWidget(input: DeleteWidgetInput): Widget
}

interface Node {
  # The id of the object.
  id: ID!
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

type Query {
  node(id: ID): Node
  viewer(userId: ID): Viewer
}

input UpdateWidgetInput {
  cost: Int
  name: String
  id: ID!
  clientMutationId: String!
}

type User implements Node {
  id: ID!
  name: String!
  company: Company
  clientMutationId: String
}

type Viewer {
  user: User
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
`