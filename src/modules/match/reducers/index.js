import { combineReducers } from 'redux'
import { REDUCER_NAME } from '../constants/ReducerTypes'

import gameplayReducer from './gameplay'
import matchReducer from './match'
import statsReducer from './stats'

export default {
    [REDUCER_NAME]: combineReducers({
        gameplay: gameplayReducer,
        match: matchReducer,
        stats: statsReducer,
    }),
}
