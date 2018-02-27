## Managing local schemas
On start up, run `save-graphql-schema` and save two different versions of the current graphql schema.

1. `schema.json`

  [eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql) needs the schema in [introspection query result](https://github.com/graphql/graphql-js/blob/master/src/utilities/introspectionQuery.js) saved in a json file to correctly lint graphql fragments

2. `schema-graphql.js`

  To mock our current graphql schema inside of [react-cosmos](https://github.com/react-cosmos/react-cosmos) we're using [`makeExecutableSchema`](https://www.apollographql.com/docs/graphql-tools/generate-schema.html#example) from [`graphql-tools`](https://github.com/apollographql/graphql-tools) to generate a functioning schema.  This requires a GraphQL type language string.  This file just exports the string in question.

## Scrimshaw
This stack relies heavily on [`scrimshaw-react`](https://github.com/cbranch101/scrimshaw-react) for coordinating GraphQL data with React.  You can refer to the docs on scrimshaw [here](https://cbranch101.github.io/scrimshaw-react/)
