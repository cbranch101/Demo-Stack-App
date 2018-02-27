import { RESOURCE_LOADER_STATE } from "./actions"

export default function(state = {}, action) {
    if (action.type == RESOURCE_LOADER_STATE) {
        const { id, resourceState, error, cacheKey = null } = action.payload
        return {
            ...state,
            [id]: {
                loaded: resourceState,
                error,
                cacheKey
            }
        }
    }
    return state
}
