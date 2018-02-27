import React from "react"
import PropTypes from "prop-types"
import { connect as react_redux_connect } from "react-redux"

import { fetchUser } from "../actions/user"
import { fetchPosts } from "../actions/posts"
import { createLoader } from "../loader"

const emptyDispatch = action => action

// This is a shim to expose the same interface as `react-redux`'s connect() to
// make the transition easier.
const connect = function(mapStateToProps, mapDispatchToProps = {}, mergeProps, options = {}) {
    // Loader expects dispatch to be included in `props`
    mapDispatchToProps.dispatch = emptyDispatch
    return react_redux_connect(mapStateToProps, mapDispatchToProps, mergeProps, options)
}

const userResource = ({ dispatch, rootState }) => ({
    id: `current-user`,
    load: () => {
        return dispatch(fetchUser())
    },
    find: () => {
        return rootState.user
    }
})

const postsResource = ({ dispatch, rootState }, user) => ({
    id: `posts-${user.id}`,
    load: () => {
        return dispatch(fetchPosts())
    },
    find: () => {
        return rootState.posts
    }
})

const LoaderTest = ({ user, posts }) => {
    return (
        <div>
            <div>Posts for : {user.name}</div>
            <ul>{posts.map((post, index) => <li key={index}>{post.text}</li>)}</ul>
        </div>
    )
}

LoaderTest.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired
        })
    ),
    user: PropTypes.shape({
        name: PropTypes.name
    })
}

const LoaderTestLoader = createLoader({
    renderBusy() {
        return <div>Loading</div>
    },
    component: LoaderTest,
    resources: {
        user(options) {
            return userResource(options)
        },
        posts: {
            depends: ["user"],
            posts(options, user) {
                return postsResource(options, user)
            }
        }
    }
})

export default connect(state => ({
    rootState: state
}))(LoaderTestLoader)
