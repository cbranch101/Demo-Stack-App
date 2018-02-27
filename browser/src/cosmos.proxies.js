import Chance from "chance"
import createReduxProxy from "react-cosmos-redux-proxy"
import createRouterProxy from "react-cosmos-router-proxy"

import createScrimsawProxy from "./create-scrimshaw-proxy"
import createFetchProxy from "./create-fetch-proxy"
import createFetchTreeProxy from "./create-fetch-tree-proxy"
import configureStore from "./configure-store"

const dbChance = new Chance("test")
const generateNItems = (n, getItem) => {
    return dbChance.n(dbChance.guid, n).map(id => {
        const subChance = new Chance(id)
        const item = getItem(subChance)
        return Object.assign(
            {
                id
            },
            item
        )
    })
}

const widgets = generateNItems(20, chance => ({
    name: chance.sentence({ words: 3 }),
    cost: chance.integer({ min: 5, max: 5000 })
}))

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
        company_id: "1"
    }
]

// refer to the docs for mocking a GraphQL schema here
// https://github.com/cbranch101/mock-relay-server

const mocks = {
    Query: {
        resolver: connections => ({
            viewer: async (query, { userId }) => {
                const user = await connections.User.getNode(userId)
                return { user }
            }
        })
    },
    Widget: {
        data: widgets
    },
    Company: {
        data: companies,
        resolver: connections => ({
            widgetList: connections.Widget.paginate
        })
    },
    User: {
        data: users,
        resolver: connections => ({
            company: user => connections.Company.getNode(user.company_id)
        })
    },
    Mutation: {
        resolver: connections => ({
            updateWidget: connections.Widget.update,
            addWidget: connections.Widget.create,
            deleteWidget: connections.Widget.delete
        })
    }
}

// Read more about configuring Redux in the Redux proxy section below
const ReduxProxy = createReduxProxy({
    createStore: state => configureStore(state)
})

// We ensure a specific proxy order
export default [
    // Not all proxies have options, and often relying on defaults is good enough
    createFetchTreeProxy(),
    ReduxProxy,
    createRouterProxy(),
    createScrimsawProxy({
        mocks
    }),
    createFetchProxy()
]
