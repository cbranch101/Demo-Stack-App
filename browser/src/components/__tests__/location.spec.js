import React from "react"
import { mount } from "enzyme"
import { MemoryRouter } from "react-router"

import Location from "../location"

const PropContainer = props => {
    return (
        <div data-test="prop-container" data-props={props}>
            {JSON.stringify(props)}
        </div>
    )
}

const sel = id => `[data-test="${id}"]`

const getPropsFromMountedTestComponent = (props, location) => {
    const WrappedComponent = () => {
        return (
            <Location
                render={renderProps => {
                    return <PropContainer {...renderProps} />
                }}
            />
        )
    }
    const wrapper = mount(
        <MemoryRouter initialEntries={[location]} initialIndex={0} context={{}}>
            <WrappedComponent />
        </MemoryRouter>
    )
    return wrapper.find(sel("prop-container")).props()["data-props"]
}

test("should add the required props", () => {
    const locationToSet = {
        pathname: "/test",
        search: "?page=3"
    }
    const props = getPropsFromMountedTestComponent({}, locationToSet)
    const { location } = props
    const cleanedUpLocation = {
        ...location,
        key: undefined
    }
    expect({ ...props, location: cleanedUpLocation }).toMatchSnapshot()
})

test("should set a default of 1 if no page is provided", () => {
    const location = {
        pathname: "/test"
    }
    const { location: { query } } = getPropsFromMountedTestComponent({}, location)
    const expected = {
        page: 1
    }
    expect(query).toEqual(expected)
})

test("should set a default of 1 if no page is provided", () => {
    const location = {
        pathname: "/test"
    }
    const { location: { query } } = getPropsFromMountedTestComponent({}, location)
    const expected = {
        page: 1
    }
    expect(query).toEqual(expected)
})

test("should handle provided function functions", () => {
    const passedLocation = {
        pathname: "/test"
    }
    const { push } = getPropsFromMountedTestComponent({}, passedLocation)
    push(location => {
        expect(location.pathname).toEqual(passedLocation.pathname)
        return passedLocation
    })
})
