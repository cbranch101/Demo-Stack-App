import React from "react"
import PropTypes from "prop-types"

class State extends React.Component {
    constructor(props) {
        super(props)
        this.state = props.initialState || {}
    }
    static propTypes = {
        render: PropTypes.func.isRequired,
        handlers: PropTypes.object,
        initialState: PropTypes.object
    }
    getState = () => {
        return this.state
    }
    render = () => {
        const { render, handlers = {} } = this.props

        const stateHandlers = Object.keys(handlers).reduce((acc, handlerName) => {
            const func = handlers[handlerName]
            const handler = (...args) => this.setState(func(...args))
            acc[handlerName] = handler
            return acc
        }, {})
        return render({
            setState: (...args) => this.setState(...args),
            ...this.state,
            getState: this.getState,
            ...stateHandlers
        })
    }
}

export default State
