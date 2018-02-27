import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { withFragments, gql } from "scrimshaw-react"

const WidgetRow = ({ widget, updateWidget }) => {
    return (
        <tr key={widget.id}>
            <td>
                <Link to={`/widgets/${widget.id}`}>{widget.name}</Link>
            </td>
            <NumberHolder>{widget.cost}</NumberHolder>
            <button onClick={() => updateWidget({ id: widget.id, cost: widget.cost + 5 })}>
                Add 5
            </button>
        </tr>
    )
}

const NumberHolder = styled.td`font-size: 22px;`

WidgetRow.propTypes = {
    updateWidget: PropTypes.func.isRequired,
    widget: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        cost: PropTypes.number.isRequired
    })
}

const enhance = withFragments({
    widget: gql`
        fragment on Widget {
            id
            name
            cost
        }
    `
})

export default enhance(WidgetRow)
