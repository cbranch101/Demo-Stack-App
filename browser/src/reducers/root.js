import { combineReducers } from "redux"
import { reducer as scrimshaw } from "scrimshaw-react"

import { reducer as loader } from "../loader"
import user from "./user"
import posts from "./posts"

export default combineReducers({
    scrimshaw,
    user,
    posts,
    loader
})
