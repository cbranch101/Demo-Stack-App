export const getPromiseHandler = () => {
    let defs = []
    let defIndex = 0

    const getDeferred = returnValue => {
        const deferred = {}
        const promise = new Promise((resolve, reject) => {
            deferred.resolve = () => {
                resolve(returnValue)
                return returnValue
            }
            deferred.reject = reject
        })
        deferred.promise = promise
        return deferred
    }

    const init = returnValues => {
        defIndex = 0
        defs = returnValues.map(value => getDeferred(value))
    }

    return {
        init,
        resolve: () => {
            const returnValue = defs[defIndex].resolve()
            defIndex = defIndex + 1
            return returnValue
        },
        execute: index => {
            return defs[index].promise
        }
    }
}
