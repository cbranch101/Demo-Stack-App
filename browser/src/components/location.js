import React from "react"
import PropTypes from "prop-types"
import { Route } from "react-router"
import queryString from "query-string"

const getUpdatedLocation = location => {
    const query = queryString.parse(location.search)
    const page = Number(query.page || 1)
    const updatedQuery = {
        ...query,
        page
    }
    return {
        ...location,
        query: updatedQuery
    }
}

const buildGetOutputLocation = updatedLocation => location => {
    const newLocation = typeof location === "function" ? location(updatedLocation) : location
    const { query = {}, ...toPass } = newLocation
    return {
        ...toPass,
        search: Object.keys(query).length === 0 ? "" : queryString.stringify(query)
    }
}

class Location extends React.Component {
    render = () => {
        return (
            <Route
                render={({ location, history, ...routerProps }) => {
                    const updatedLocation = getUpdatedLocation(location)
                    const getOutputLocation = buildGetOutputLocation(updatedLocation)
                    const push = newLocation => history.push(getOutputLocation(newLocation))
                    const replace = newLocation => history.replace(getOutputLocation(newLocation))
                    return this.props.render({
                        ...routerProps,
                        push,
                        replace,
                        location: updatedLocation
                    })
                }}
            />
        )
    }
}

Location.propTypes = {
    render: PropTypes.func.isRequired
}

export default Location
