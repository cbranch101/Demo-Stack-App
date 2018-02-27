import { POSTS_FETCHED } from "../actions/posts"

export default (state = [], action) => {
    switch (action.type) {
        case POSTS_FETCHED:
            return action.data
        default:
            return state
    }
}
