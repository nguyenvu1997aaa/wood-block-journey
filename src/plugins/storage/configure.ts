import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from '@/redux/reducers'

const REDUX_TOOL = import.meta.env.SNOWPACK_PUBLIC_REDUX_TOOL
const { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: DEVTOOL } = window

let composeEnhancers = compose

const configureStore = (initState: TObject): ReduxStore => {
    if (REDUX_TOOL === 'true' && DEVTOOL) {
        composeEnhancers = DEVTOOL({ trace: true, traceLimit: 25 }) || compose
    }

    const enhancer = composeEnhancers(applyMiddleware(thunk))

    return createStore(rootReducer, initState, enhancer)
}

export default configureStore
