import React from "react"
import { proxyPropTypes } from "react-cosmos-shared/lib/react"

const getUpdatedFixture = fixture => {
    if (!fixture.fetchTreeMocks) {
        return fixture
    }
    const reduxState = fixture.fetchTreeMocks.reduce(
        (memo, { data, rootKey, loaderKey }) => {
            const memoWithData =
                typeof rootKey === "function"
                    ? rootKey(memo, data)
                    : {
                        ...memo,
                        [rootKey]: data
                    }

            return {
                ...memoWithData,
                loader: {
                    ...memo.loader,
                    [loaderKey]: {
                        loaded: 2,
                        cacheKey: null
                    }
                }
            }
        },
        {
            loader: {}
        }
    )
    return {
        ...fixture,
        reduxState: {
            ...reduxState,
            ...fixture.reduxState
        }
    }
}

export default () => {
    const NoopProxy = props => {
        const { nextProxy, fixture, ...rest } = props
        const updatedFixture = getUpdatedFixture(fixture)
        const { value: NextProxy, next } = nextProxy

        return <NextProxy {...rest} fixture={updatedFixture} nextProxy={next()} />
    }

    NoopProxy.propTypes = proxyPropTypes

    return NoopProxy
}
