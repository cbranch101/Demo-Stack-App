import createTestContext from "react-cosmos-test/enzyme"

import fixture from "../__fixtures__/basic"

const { mount, getWrapper } = createTestContext({ fixture })

beforeEach(mount)

test("renders basic loader data", async () => {
    expect(getWrapper().html()).toMatchSnapshot()
})
