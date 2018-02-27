import { buildCurrentPages } from "../pagination"

describe("buildCurrentPages helper", () => {
    describe("if there are more than three pages", () => {
        it("should have first, last, and middle", () => {
            const actual = buildCurrentPages(3, 2, 13)
            const expected = {
                first: 1,
                previous: 2,
                current: 3,
                middle: [2, 3, 4],
                next: 4,
                last: 7
            }
            expect(actual).toEqual(expected)
        })
    })
    describe("if there are no results", () => {
        it("should have first, last, and middle", () => {
            const actual = buildCurrentPages(1, 2, 0)
            const expected = {}
            expect(actual).toEqual(expected)
        })
    })
    describe("if there are 2 pages", () => {
        it("should only have middle", () => {
            const actual = buildCurrentPages(1, 1, 2)
            const expected = {
                first: undefined,
                previous: undefined,
                current: 1,
                middle: [1, 2],
                next: 2,
                last: undefined
            }
            expect(actual).toEqual(expected)
        })
    })
    describe("if there are 4 pages", () => {
        it("first and previous should be undefined", () => {
            const actual = buildCurrentPages(1, 1, 4)
            const expected = {
                first: undefined,
                previous: undefined,
                current: 1,
                middle: [1, 2, 3],
                next: 2,
                last: 4
            }
            expect(actual).toEqual(expected)
        })
    })
    describe("with 4 pages on last page", () => {
        it("next and last should be undefined", () => {
            const actual = buildCurrentPages(4, 1, 4)
            const expected = {
                first: 1,
                previous: 3,
                current: 4,
                middle: [2, 3, 4],
                next: undefined,
                last: undefined
            }
            expect(actual).toEqual(expected)
        })
    })
    describe("with a single page", () => {
        it("middle is an empty array and current is set", () => {
            const actual = buildCurrentPages(1, 2, 2)
            const expected = {
                first: undefined,
                previous: undefined,
                current: 1,
                middle: [],
                next: undefined,
                last: undefined
            }
            expect(actual).toEqual(expected)
        })
    })
})
