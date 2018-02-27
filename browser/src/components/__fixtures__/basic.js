import LoaderTest from "../loader-test"

export default {
    component: LoaderTest,
    fetchTreeMocks: [
        {
            rootKey: "user",
            data: {
                id: "test",
                name: "Clay"
            },
            loaderKey: "current-user"
        },
        {
            rootKey: "posts",
            data: [
                {
                    id: "1",
                    text: "I'm a post"
                }
            ],
            loaderKey: "posts-test"
        }
    ]
}
