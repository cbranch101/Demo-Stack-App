import React from "react"
import wrapActionCreators from "react-redux/lib/utils/wrapActionCreators"

import resourceLoader from "./resource_loader"

const defaultMapStateToProps = () => ({})

export default (connect, resources, Busy) => (
    mapStateToProps = defaultMapStateToProps,
    mapDispatchToProps = {},
    mergeProps,
    options = {}
) => {
    // I'm using odd prop names here to avoid conflicts with user specified props
    const IS_READY = "_loader-isReady"
    const DISPATCH = "_loader-dispatch"
    const RUN_LOADER = "_loader-runLoader"

    const loader = resourceLoader(resources, {
        rootState: {
            loader: {}
        },
        dispatch: () => {}
    })

    const mapState = function(state, props) {
        const incomingProps = mapStateToProps(state, props)
        loader.newProps({
            ...props,
            ...incomingProps,
            rootState: state,
            dispatch: props[DISPATCH]
        })

        let loadedProps = { [IS_READY]: loader.isReady() }
        if (loadedProps[IS_READY]) {
            loadedProps = {
                ...loadedProps,
                ...loader.find()
            }
        }
        return {
            ...incomingProps,
            ...loadedProps
        }
    }

    const modMapDispatchToProps = (dispatch, props) => {
        const runLoader = () => (dispatch, getState) => {
            loader.newProps({
                ...props,
                rootState: getState(),
                dispatch: dispatch
            })
            loader.load()
        }

        // magic
        const stuff = {
            ...mapDispatchToProps,
            [RUN_LOADER]: runLoader
        }

        return wrapActionCreators(stuff)
    }

    const connectTo = connect(mapState, modMapDispatchToProps, mergeProps, options)

    return Component => {
        const displayName = Component.displayName || Component.name

        class LoadingCheck extends React.Component {
            static displayName = `LoadingCheck(${displayName})`

            componentWillMount() {
                if (!this.props[IS_READY]) {
                    this.props[RUN_LOADER]()
                }
            }
            componentWillReceiveProps(props) {
                if (!props[IS_READY]) {
                    props[RUN_LOADER]()
                }
            }

            render() {
                if (!this.props[IS_READY]) {
                    if (Busy == null) {
                        // At least with React 0.13, returning null here causes
                        // React to replace the `<noscript` placeholder every time.
                        // TODO: Try null here when we upgrade to React 15
                        return <span />
                    }

                    return <Busy />
                }
                return <Component {...this.props} />
            }
        }

        const Middle = connectTo(LoadingCheck)

        function GrabDispatch(props, context) {
            let dispatch
            if (context.store) {
                dispatch = context.store.dispatch
            } else if (props.store) {
                dispatch = props.store.dispatch
            }
            const withDispatch = {
                ...props,
                [DISPATCH]: dispatch
            }

            return <Middle {...withDispatch} />
        }
        GrabDispatch.displayName = `GrabDispatch(${Middle.displayName})`
        GrabDispatch.propTypes = {
            store: React.PropTypes.shape({
                dispatch: React.PropTypes.func.isRequired
            })
        }
        GrabDispatch.contextTypes = {
            store: React.PropTypes.shape({
                dispatch: React.PropTypes.func.isRequired
            }).isRequired
        }

        return GrabDispatch
    }
}
