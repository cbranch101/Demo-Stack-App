import React from "react"
import uuid from "uuid-v4"
import { withQuery, withMutation, gql } from "scrimshaw-react"

import { RESULTS_PER_PAGE } from "../components/pagination/pagination"
import App from "../components/app"
import Location from "../components/location"
import { createMutation } from "../components/create-widget"
import { addUpdatedWidgetsToWidgetList } from "../components/widget-list"

const appQuery = gql`
    query Viewer($userId:ID, $first: Int, $after: String, $offset: Int) {
        viewer(userId: $userId) {
            user {
              company {
                  ...${App.fragments.company}
                  widgetList(first: $first, after: $after, offset: $offset) {
                      ...${App.fragments.widgetList}
                  }
              }
            }
        }
    }
`

export const updateWidgetMutation = gql`
    mutation($input: UpdateWidgetInput!) {
        updateWidget(input: $input) {
            name
            cost
            id
            clientMutationId
        }
    }
`

const CreateMutation = withMutation(createMutation, {})
const UpdateMutation = withMutation(updateWidgetMutation, {
    reducers: {
        app: (appData, updatedWidget) => {
            const updatedValue = {
                ...appData,
                viewer: {
                    ...appData.viewer,
                    user: {
                        ...appData.viewer.user,
                        company: {
                            ...appData.viewer.user.company,
                            widgetList: addUpdatedWidgetsToWidgetList(
                                appData.viewer.user.company.widgetList,
                                [updatedWidget]
                            )
                        }
                    }
                }
            }
            return updatedValue
        }
    }
})

const Query = withQuery(appQuery, {
    queryKey: "app",
    loadingComponent: <div>Loading</div>
})

const getVariables = ({ query: { page } }) => {
    const offset = (page - 1) * RESULTS_PER_PAGE
    return {
        userId: "User__1",
        offset,
        first: RESULTS_PER_PAGE
    }
}

const AppContainer = () => {
    return (
        <Location
            render={({ location }) => {
                return (
                    <Query
                        variables={getVariables(location)}
                        render={queryProps => {
                            const { viewer: { user: { company } }, refetch } = queryProps
                            const { widgetList, ...restOfCompany } = company
                            return (
                                <UpdateMutation
                                    render={({ mutate, mutating, inputs }) => {
                                        const updateWidget = input =>
                                            mutate({
                                                ...input,
                                                clientMutationId: uuid()
                                            })
                                        const optimisticWidgetList = mutating
                                            ? addUpdatedWidgetsToWidgetList(widgetList, inputs)
                                            : widgetList
                                        return (
                                            <CreateMutation
                                                render={({ mutate }) => {
                                                    const createWidget = widget =>
                                                        mutate(widget).then(() => refetch())
                                                    return (
                                                        <App
                                                            company={restOfCompany}
                                                            widgetList={optimisticWidgetList}
                                                            createWidget={createWidget}
                                                            updateWidget={updateWidget}
                                                        />
                                                    )
                                                }}
                                            />
                                        )
                                    }}
                                />
                            )
                        }}
                    />
                )
            }}
        />
    )
}

export default AppContainer
