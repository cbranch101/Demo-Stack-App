export const RESOURCE_LOADER_STATE = "RESOURCE_LOADER_STATE"
export const NEW = undefined
export const LOADING = 1
export const LOADED = 2

function setState(resource, resourceState, error) {
    return {
        type: RESOURCE_LOADER_STATE,
        payload: {
            id: resource.id,
            cacheKey: resource.cacheKey,
            resourceState,
            error
        }
    }
}

export function loadResource(dispatch, resource) {
    dispatch(setState(resource, LOADING))

    const promise = resource.load()
    if (promise == null || promise.then == null) {
        throw new Error(`${resource.id}:load() failed to return a promise`)
    }

    return promise.then(
        () => {
            dispatch(setState(resource, LOADED))
        },
        e => {
            dispatch(setState(resource, LOADED, e))
        }
    )
}
