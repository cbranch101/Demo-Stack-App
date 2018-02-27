import React from "react"
import PropTypes from "prop-types"
import { withQuery, gql } from "scrimshaw-react"

import SingleWidget from "../components/single-widget"

const singleWidgetQuery = gql`
    query SingleWidgetQuery($id: ID) {
        node(id: $id) {
            id
            ... on Widget {
                ...${SingleWidget.fragments.widget}
            }
        }
    }
`

const Query = withQuery(singleWidgetQuery, {
    queryKey: "singleWidget",
    loadingComponent: <div>Loading</div>
})

const SingleWidgetContainer = ({ match: { params: { widgetId: id } } }) => {
    return (
        <Query
            variables={{ id }}
            render={({ node }) => {
                return <SingleWidget widget={node} />
            }}
        />
    )
}

SingleWidgetContainer.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            widgetId: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
}

export default SingleWidgetContainer
