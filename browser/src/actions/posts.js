export const POSTS_FETCHED = "POSTS_FETCHED"

const postsFetched = data => ({
    type: POSTS_FETCHED,
    data
})

export const fetchPosts = userId => dispatch => {
    return fetch(`/user/${userId}/posts`)
        .then(response => response.json())
        .then(data => {
            dispatch(postsFetched(data.items))
        })
}
