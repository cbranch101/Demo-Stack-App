import React from "react"
import PropTypes from "prop-types"
import { Switch as BaseSwitch, Route } from "react-router-dom"

const Switch = ({ render, pathMap }) => {
    return (
        <BaseSwitch>
            {Object.keys(pathMap).map(path => {
                const isExact = path.substring(0, 5) === "exact"
                const finalPath = isExact ? path.split(" ")[1] : path
                const value = pathMap[path]
                return (
                    <Route
                        key={path}
                        exact={isExact}
                        path={finalPath}
                        render={() => render(value)}
                    />
                )
            })}
        </BaseSwitch>
    )
}

Switch.propTypes = {
    render: PropTypes.func.isRequired,
    pathMap: PropTypes.object.isRequired
}

export default Switch
