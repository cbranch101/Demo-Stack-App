import { mockResponses } from "../promise-handler"

const unpackResponse = promise => promise.then(response => response.json())

test("Should correctly mock array response", async () => {
    const listener = mockResponses([
        {
            matcher: "/users",
            method: "GET",
            response: [{ name: "John" }, { name: "Tom" }]
        }
    ])

    const firstResponse = await unpackResponse(fetch("/users"))
    expect(firstResponse).toMatchSnapshot()
    const secondResponse = await unpackResponse(fetch("/users"))
    expect(secondResponse).toMatchSnapshot()
    listener.unmock()
})

test("Should allow for an array of responses to be supplied and return a listener", async () => {
    const listener = mockResponses([
        {
            matcher: "/users",
            method: "GET",
            response: [{ name: "John" }, { name: "Tom" }]
        }
    ])

    setTimeout(() => fetch("/users"), 1)
    setTimeout(() => fetch("/users"), 2)
    const firstReturn = await listener.next()
    expect(firstReturn).toMatchSnapshot()
    const secondReturn = await listener.next()
    expect(secondReturn).toMatchSnapshot()
    listener.unmock()
})

test("Should handle a single response correctly", async () => {
    const listener = mockResponses([
        {
            matcher: "/users",
            method: "GET",
            response: { name: "John" }
        }
    ])

    setTimeout(() => fetch("/users"), 1)
    const firstReturn = await listener.next()
    expect(firstReturn).toMatchSnapshot()
    listener.unmock()
})

test("Should handle a function responses correctly", async () => {
    const listener = mockResponses([
        {
            matcher: "/users",
            method: "GET",
            response: url => ({
                name: url
            })
        }
    ])

    setTimeout(() => fetch("/users"), 1)
    const firstReturn = await listener.next()
    expect(firstReturn).toMatchSnapshot()
    listener.unmock()
})

test("Should be possible to throw errors", async () => {
    const listener = mockResponses([
        {
            matcher: "/users",
            method: "GET",
            response: { MOCK_ERROR: new Error("message") }
        }
    ])

    setTimeout(() => fetch("/users"), 1)
    try {
        await listener.next()
    } catch (e) {
        expect(e.message).toEqual("message")
        listener.unmock()
    }
})

test("Should correctly handle mocked requests to the same url", async () => {
    const listener = mockResponses([
        {
            matcher: "/users",
            method: "GET",
            response: [{ name: "John" }, { name: "Tom" }]
        },
        {
            matcher: "/users",
            method: "POST",
            response: { name: "George" }
        }
    ])

    setTimeout(() => fetch("/users"), 1)
    setTimeout(() => fetch("/users", { method: "POST" }), 2)
    setTimeout(() => fetch("/users"), 3)
    const firstReturn = await listener.next()
    expect(firstReturn).toMatchSnapshot()
    const secondReturn = await listener.next()
    expect(secondReturn).toMatchSnapshot()
    const thirdReturn = await listener.next()
    expect(thirdReturn).toMatchSnapshot()
    listener.unmock()
})

test("Should be able to handle for processing steps after fetch", async () => {
    let finished = false
    const listener = mockResponses([
        {
            chain: promise => promise.then(data => data),
            matcher: "/users",
            method: "GET",
            response: [{ name: "John" }, { name: "Tom" }]
        }
    ])

    setTimeout(
        () =>
            fetch("/users").then(data => {
                finished = true
                return data
            }),
        1
    )
    await listener.next()
    expect(finished).toEqual(true)

    listener.unmock()
})
