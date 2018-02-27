import React from "react"

import resourceLoader from "./resource_loader"

export default function create(options) {
    const {
        busy: Busy, // optional
        renderBusy, // optional
        propTypes = {}, // optional
        component: Component
    } = options

    function nextState(loader) {
        const ready = loader.isReady()

        return {
            ready,
            resources: ready == true ? loader.find() : {}
        }
    }

    if (process.env.NODE_ENV != "production") {
        propTypes.rootState = React.PropTypes.object.isRequired
        propTypes.dispatch = React.PropTypes.func.isRequired
    }

    const displayName = Component.displayName || Component.name
    return class Loader extends React.Component {
        static displayName = displayName
        static propTypes = propTypes

        static loadResources(props) {
            const loader = resourceLoader(options.resources, props)
            return loader.load()
        }

        constructor(props) {
            super(props)
            this.loader = resourceLoader(options.resources, props)

            this.state = nextState(this.loader)
        }

        componentWillMount() {
            this.loader.load()
        }

        componentWillReceiveProps(nextProps) {
            this.loader.newProps(nextProps)
            this.loader.load()
            this.setState(nextState(this.loader))
        }

        render() {
            const {
                rootState, // eslint-disable-line no-unused-vars
                ...props
            } = this.props

            if (!this.state.ready) {
                if (typeof renderBusy === "function") {
                    return renderBusy(props)
                }
                if (Busy == null) {
                    // At least with React 0.13, returning null here causes
                    // React to replace the `<noscript` placeholder every time.
                    // TODO: Try null here when we upgrade to React 15
                    return <span />
                }

                return <Busy />
            }

            return <Component {...props} {...this.state.resources} />
        }
    }
}
