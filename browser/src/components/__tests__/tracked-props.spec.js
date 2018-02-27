import React from "react"
import { mount } from "enzyme"

import TrackedProps from "../tracked-props"

const getMountedComponent = props => {
    return mount(<TrackedProps {...props} />)
}

test("should trigger onMount when the component mounts", () => {
    const onMount = jest.fn()
    const props = {
        values: {
            foo: "bar"
        },
        onMount
    }
    getMountedComponent(props)
    expect(onMount.mock.calls.length).toBe(1)
})

test("should trigger onChanged callback if hasChanged callback returns true", () => {
    const props = {
        values: {
            foo: "bar"
        },
        hasChanged: (current, next) => {
            return current.foo !== next.foo
        },
        onChange: jest.fn()
    }
    const wrapper = getMountedComponent(props)
    expect(props.onChange.mock.calls.length).toBe(0)
    wrapper.setProps({ values: { foo: "biz" } })
    expect(props.onChange.mock.calls.length).toBe(1)
    expect(props.onChange).toBeCalledWith({ foo: "biz" })
})

test("by default, onChanged should just deep equal check values", () => {
    const props = {
        values: {
            foo: "bar"
        },
        onChange: jest.fn()
    }
    const wrapper = getMountedComponent(props)
    expect(props.onChange.mock.calls.length).toBe(0)
    wrapper.setProps({ values: { foo: "bar" } })
    expect(props.onChange.mock.calls.length).toBe(0)
    wrapper.setProps({ values: { foo: "biz" } })
    expect(props.onChange.mock.calls.length).toBe(1)
})
