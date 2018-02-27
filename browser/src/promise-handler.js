import fetchMock from "fetch-mock"

const getDeferred = () => {
    const deferred = {}
    const promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve
        deferred.reject = reject
    })
    deferred.promise = promise
    return deferred
}

const delayPromise = amount => new Promise(res => setTimeout(res, amount))

export const mockResponses = mockOptions => {
    const queue = [getDeferred()]
    const urlIndex = {}
    const updatedOptions = mockOptions.map(mockOption => {
        const { delay: delayAmount = 0, ...toPassAlong } = mockOption
        return {
            ...toPassAlong,
            response: (url, ...opts) => {
                const handleResponse = () => {
                    const deferred = queue.shift()
                    deferred.url = url
                    const responses = !Array.isArray(mockOption.response)
                        ? [mockOption.response]
                        : mockOption.response
                    const urlKey = `${url}_${JSON.stringify(opts)}`
                    urlIndex[urlKey] = urlIndex[urlKey] || 0
                    const currentIndex = urlIndex[urlKey]
                    const response = responses[currentIndex]
                    const returnValue =
                        typeof response === "function" ? response(url, ...opts) : response
                    const resolver = () => {
                        if ("MOCK_ERROR" in returnValue) {
                            deferred.reject(returnValue["MOCK_ERROR"])
                        } else {
                            deferred.resolve(returnValue)
                        }
                    }
                    if (mockOption.chain) {
                        mockOption.chain(Promise.resolve(returnValue)).then(resolver)
                    } else {
                        resolver()
                    }
                    if (Array.isArray(mockOption.response)) {
                        urlIndex[urlKey] = urlIndex[urlKey] + 1
                    }
                    queue.push(getDeferred())
                    return response
                }

                return delayAmount > 0
                    ? delayPromise(delayAmount).then(handleResponse)
                    : handleResponse()
            }
        }
    })

    updatedOptions.forEach(option => {
        fetchMock.mock(option)
    })
    return {
        next: () => {
            return queue[queue.length - 1].promise
        },
        unmock: () => fetchMock.restore()
    }
}
