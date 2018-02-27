This loader is based on the public interface for [redux-loader][redux-loader]. I
opened an issue there and never got a response from the developers. My goal is
not to maintain compatibility, just to use what I like of their public API as a
place to start.

Setting up Loader
=================

The loader's reducer must manage the `.loader` key on your root state.

```js
import { reducer as loader } from './loader'
export default combineReducers({
    /* your other reducers */
    loader,
})
```

Using the loader
================

```js
const LoaderView = createLoader({

    // busy is optional. If you don't specify it then loader will just not
    // render anything until the data is available.
    busy: Loader,
    component: TermView,

    // Some resources have dependencies. If they don't it needs to be a function
    // that accepts `options` and MUST return a resource definition. Otherwise
    // the top level is an object with `dependencies` (an array of resources
    // this depends on) and and a function that accepts `options` followed by
    // any dependencies, and returns a resource definition.
    /*
    options = {
        // All of these props will get passed to your component
        props,
        dispatch,
        rootState,
        // You can use this inside your `load()` to preload data for a component
        // you know will need to be rendered
        preload(Component, childProps)
    }
    */
    resources: {
        foo(options) {
            return {
                // id is required if your definition has a `load()`. This key
                // tracks the progress of loading this resource
                id: `foo-${options.props.fooId}`
                // load MUST return a Promise. Once the promise resolves
                // `find()` should be able to locate the data in the store
                load() {
                    return options.dispatch(loadFoo(options.props.fooId))
                },
                // This must return a value or `null`. `undefined` will throw to
                // help prevent forgotten `return`s
                find() {
                    return selectFoo(options.rootState, options.props.fooId)
                }

            }
        }
        bar: {
            depends: [ 'foo' ],
            bar(options, foo) {
                return {
                    id: `bar-${foo.barId}`,
                    load() {
                        return options.dispatch(loadBar(foo.barId))
                    },
                    find() {
                        return selectBar(options.rootState, foo.barId))
                    }

                }
            }
        },
        computed: {
            depends: [ 'bar' ],
            computed(options, bar) {
                // This one doesn't need an `id` or `load` because it's just
                // going to compute some value based on `bar` and the state
                return {
                    find() {
                        return selectComputed(options.rootState, bar)
                    }
                }
            }
        }
    }
})

function mapStateToProps(state) {
    // You can add other props if you need to, but you have to at least pass
    // back `rootState` so the loader can use it
    return { rootState: state }
}
export default connect(mapStateToProps)(LoaderView)
```


[redux-loader]: https://github.com/Versent/redux-loader/
