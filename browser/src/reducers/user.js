import { USER_FETCHED } from "../actions/user"

export default (state = {}, action) => {
    switch (action.type) {
        case USER_FETCHED:
            return {
                ...state,
                ...action.data
            }
        default:
            return state
    }
}
