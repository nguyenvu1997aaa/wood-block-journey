import { createSelector } from 'reselect'
import { getState } from './index'

const getLivesState = (state) => getState(state).lives
const getLastBonusLifeTimeState = (state) => getState(state).lastBonusLifeTime
const getCountDownStartAtState = (state) => getState(state).countDownStartAt

export const getLives = createSelector([getLivesState], (lives) => lives)
export const getLastBonusLifeTime = createSelector(
    [getLastBonusLifeTimeState],
    (lastBonusLifeTime) => lastBonusLifeTime
)
export const getCountDownStartAt = createSelector(
    [getCountDownStartAtState],
    (countDownStartAt) => countDownStartAt
)
