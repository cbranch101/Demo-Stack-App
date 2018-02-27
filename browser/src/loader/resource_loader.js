import { loadResource, NEW, LOADED } from "./actions"

const skipResource = {
    find() {}
}

function verifyProps(fullProps) {
    if (!fullProps) {
        throw new Error("props requried")
    }
    if (fullProps.rootState == null) {
        throw new Error("props.rootState required")
    }
    if (typeof fullProps.dispatch !== "function") {
        throw new Error("props.dispatch required")
    }
}

function selectResourceState(state, definition) {
    const tmp = state.loader[definition.id]

    if (tmp && tmp.cacheKey == definition.cacheKey) {
        return tmp.loaded
    }
}

function isLoaded(state, definition) {
    return (
        definition != skipResource &&
        (definition.lazy ||
            definition.id == null ||
            selectResourceState(state, definition) === LOADED)
    )
}

function unwrapDependency(rootState, processed, key, definition) {
    if (!Array.isArray(definition.depends) && process.env.NODE_ENV != "production") {
        throw new Error(`depends must be an Array`)
    }
    const depsReady = definition.depends.every(parentKey => {
        const parent = processed[parentKey]
        if (parent == null) {
            throw new Error(`Invalid dependency: ${parentKey}`)
        }
        return isLoaded(rootState, parent)
    })

    if (depsReady) {
        return options => {
            const parentValues = definition.depends.map(k => processed[k].find())

            return definition[key](options, ...parentValues)
        }
    }
    return () => skipResource
}

function memoizeDefinition(definition) {
    const { find } = definition
    let result

    definition.find = (...args) => {
        if (result == undefined) {
            result = find(...args)
        }
        return result
    }

    return definition
}

function generateResourceDefinitions(resources, fullProps) {
    verifyProps(fullProps)
    const { dispatch, rootState, ...props } = fullProps
    const options = {
        dispatch,
        rootState,
        props,
        preload(Component, childProps) {
            if (!Component.loadResources) {
                throw new Error(`${Component.displayName} doesn't seem to have a Loader`)
            }

            return Component.loadResources({
                rootState,
                dispatch,
                ...childProps
            })
        }
    }
    return Object.keys(resources).reduce((processed, key) => {
        let definitionFactory = resources[key]
        if (definitionFactory.depends) {
            definitionFactory = unwrapDependency(rootState, processed, key, definitionFactory)
        }
        if (typeof definitionFactory !== "function") {
            throw new Error(`Failed to generate a function?`)
        }

        let definition = definitionFactory(options)
        if (definition == null) {
            throw new Error(`${key} failed to return a resource definition`)
        }
        if (definition.id && !definition.load) {
            throw new Error(`${key} load is required if your resource has an id`)
        }
        if (definition.load && !definition.id) {
            throw new Error(`${key} load isn't used if the resource doesn't have an id`)
        }
        // If it doesn't need to load any data you can just return the find
        // function without wrapping it in an object.
        if (typeof definition === "function") {
            const find = definition
            definition = { find }
        }

        processed[key] = memoizeDefinition(definition)
        return processed
    }, {})
}

export default function resourceLoader(resources, props) {
    if (!resources || Object.keys(resources).length === 0) {
        throw new Error("Invalid resources")
    }

    let resourceDefinitions = generateResourceDefinitions(resources, props)

    return {
        newProps(p) {
            if (p !== props) {
                props = p
                resourceDefinitions = generateResourceDefinitions(resources, props)
            }
        },
        // WARNING: This function only starts the loading process for
        // any new requests. If it doesn't return a Promise that does
        // NOT mean the resources are ready for a .find()
        load() {
            const { dispatch, rootState } = props

            const loadingPromises = Object.keys(resourceDefinitions).reduce((promises, key) => {
                const definition = resourceDefinitions[key]

                if (definition.id != null && selectResourceState(rootState, definition) == NEW) {
                    promises.push(loadResource(dispatch, definition))
                }
                return promises
            }, [])

            if (loadingPromises.length > 0) {
                return Promise.all(loadingPromises)
            }

            return // this does NOT mean isReady(fullProps) would be true
        },
        isReady() {
            const { rootState } = props

            return Object.keys(resourceDefinitions).every(key => {
                const definition = resourceDefinitions[key]
                return isLoaded(rootState, definition)
            })
        },
        find() {
            const { rootState } = props

            return Object.keys(resourceDefinitions).reduce((newProps, key) => {
                const definition = resourceDefinitions[key]

                if (isLoaded(rootState, definition)) {
                    newProps[key] = definition.find()
                    if (newProps[key] === undefined) {
                        // Use null if you need to return an empty value
                        throw new Error(`${key} find() failed to return a value`)
                    }
                }

                return newProps
            }, {})
        }
    }
}
