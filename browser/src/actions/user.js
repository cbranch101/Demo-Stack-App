export const USER_FETCHED = "USER_FETCHED"

const userFetched = data => ({
    type: USER_FETCHED,
    data
})

export const fetchUser = () => dispatch => {
    return fetch("/user")
        .then(response => response.json())
        .then(data => {
            dispatch(userFetched(data))
        })
}
