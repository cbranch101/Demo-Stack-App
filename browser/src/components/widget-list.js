import React from "react"
import PropTypes from "prop-types"
import { withFragments, gql } from "scrimshaw-react"

import WidgetRow from "./widget-row"
import CreateWidget from "./create-widget.js"
import Pagination from "./widget-list/pagination"

const enhance = withFragments({
    company: gql`
        fragment on Company {
            id
        }
    `,
    widgetList: gql`
        fragment on WidgetConnection {
            ...${Pagination.fragments.widgetList}
            edges {
                node {
                    ...${WidgetRow.fragments.widget}
                }
            }
        }

    `
})

const traverseWidgetList = (widgetList, func) => {
    return widgetList.edges.map(connection => func(connection.node, connection))
}

const getWidgetListWithUpdatedNodes = (widgetList, func) => {
    const updatedEdges = traverseWidgetList(widgetList, (widget, connection) => {
        return {
            ...connection,
            node: {
                ...widget,
                ...func(widget, connection)
            }
        }
    })
    return {
        ...widgetList,
        edges: updatedEdges
    }
}

export const addUpdatedWidgetsToWidgetList = (widgetList, updatedWidgets) => {
    return getWidgetListWithUpdatedNodes(widgetList, widget => {
        return updatedWidgets.reduce((outputWidget, updatedWidget) => {
            if (outputWidget.id !== updatedWidget.id) return outputWidget
            return {
                ...outputWidget,
                ...updatedWidget
            }
        }, widget)
    })
}

const WidgetList = ({ widgetList, createWidget, updateWidget }) => {
    return (
        <div>
            <Pagination widgetList={widgetList} />
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {traverseWidgetList(widgetList, widget => {
                        return (
                            <WidgetRow
                                key={widget.id}
                                widget={widget}
                                updateWidget={updateWidget}
                            />
                        )
                    })}
                </tbody>
            </table>
            <CreateWidget onSubmit={createWidget} />
        </div>
    )
}

WidgetList.propTypes = {
    createWidget: PropTypes.func.isRequired,
    updateWidget: PropTypes.func.isRequired,
    widgetList: PropTypes.shape({
        edges: PropTypes.arrayOf(
            PropTypes.shape({
                node: PropTypes.shape({
                    id: PropTypes.string.isRequired
                })
            })
        )
    })
}

export default enhance(WidgetList)
