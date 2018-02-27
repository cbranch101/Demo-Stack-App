import React from "react"
import PropTypes from "prop-types"
import deepEqual from "deep-equal"
class TrackedProps extends React.Component {
    static propTypes = {
        onMount: PropTypes.func,
        hasChanged: PropTypes.func,
        onChange: PropTypes.func,
        values: PropTypes.object
    }
    static defaultProps = {
        hasChanged: (current, next) => !deepEqual(current, next)
    }
    componentDidMount = () => {
        if (this.props.onMount) {
            this.props.onMount()
        }
    }
    componentWillReceiveProps = nextProps => {
        if (this.props.hasChanged && this.props.hasChanged(this.props.values, nextProps.values)) {
            this.props.onChange(nextProps.values)
        }
    }
    render = () => {
        return null
    }
}

export default TrackedProps
