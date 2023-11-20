import { createSelector } from 'reselect'
import { getState } from './index'

const getMatchStatsState = (state) => getState(state).stats.data
const getMatchCurrentStatsState = (state) => getState(state).stats.current
const getMatchStatsRequestingState = (state) => getState(state).stats.isRequesting

export const getGameplayStats = createSelector([getMatchStatsState], (data) => data)

export const getGameplayCurrentStats = createSelector(
    [getMatchCurrentStatsState],
    (current) => current
)
export const getGameplayStatsRequesting = createSelector(
    [getMatchStatsRequestingState],
    (isRequesting) => isRequesting
)
