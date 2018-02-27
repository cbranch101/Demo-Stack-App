import React, { Component } from "react"
import { makeExecutableSchema } from "graphql-tools"
import { graphql } from "graphql"
import { proxyPropTypes } from "react-cosmos-shared/lib/react"
import { getMockedResolvers } from "mock-relay-server"
import { Provider as RequestClientProvider, fragmentHandler } from "scrimshaw-react"

import schemaString from "./schema-graphql"

const defaults = {
    // Must provide schema definition with query type or a type named Query.
    rootValue: {}
}

export default function createScrimsawProxy(options) {
    const { mocks, rootValue } = { ...defaults, ...options }
    const resolvers = getMockedResolvers(mocks)
    const schema = makeExecutableSchema({ typeDefs: [schemaString], resolvers })

    class ScrimshawProxy extends Component {
        constructor(props) {
            super(props)
            this.client = {
                query: (query, vars) => {
                    return graphql(
                        schema,
                        fragmentHandler.mixFragmentsIntoQuery(query),
                        rootValue,
                        {},
                        vars
                    ).then(({ data }) => {
                        return data
                    })
                },
                createFragment: fragmentHandler.createFragment,
                mutate: (query, vars) => {
                    return graphql(
                        schema,
                        fragmentHandler.mixFragmentsIntoQuery(query),
                        rootValue,
                        {},
                        vars
                    ).then(({ data }) => {
                        return data
                    })
                }
            }
        }

        render() {
            const { value: NextProxy, next } = this.props.nextProxy

            return (
                <RequestClientProvider client={this.client}>
                    <NextProxy {...this.props} nextProxy={next()} />
                </RequestClientProvider>
            )
        }
    }

    ScrimshawProxy.propTypes = proxyPropTypes

    return ScrimshawProxy
}
