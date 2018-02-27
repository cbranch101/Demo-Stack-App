import React from "react"
import PropTypes from "prop-types"
import { withFragments, gql } from "scrimshaw-react"

const SingleWidget = ({ widget }) => {
    return (
        <ul>
            <li>Name: {widget.name}</li>
            <li>Cost: {widget.cost}</li>
        </ul>
    )
}

SingleWidget.propTypes = {
    widget: PropTypes.shape({
        name: PropTypes.string.isRequired,
        cost: PropTypes.number.isRequired
    })
}

const enhance = withFragments({
    widget: gql`
        fragment on Widget {
            name
            cost
        }
    `
})

export default enhance(SingleWidget)
