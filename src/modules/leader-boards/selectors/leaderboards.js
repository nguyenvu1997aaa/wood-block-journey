import { createSelector } from 'reselect'
import { getState } from './index'

const getLeaderboardIdState = (state) => getState(state).leaderboardId
// const getLeaderboardLimitState = (state) => getState(state).limit
// const getLeaderboardOffsetState = (state) => getState(state).offset
const getLeaderboardLeadersState = (state) => getState(state).leaders
const getLeaderboardRequestingState = (state) => getState(state).isRequesting
// const getLeaderboardTypeState = (state) => getState(state).type

export const getLeaderboardId = createSelector(
    [getLeaderboardIdState],
    (leaderboardId) => leaderboardId
)

// export const getLeaderboardLimit = createSelector([getLeaderboardLimitState], (offset) => offset)

// export const getLeaderboardOffset = createSelector([getLeaderboardOffsetState], (offset) => offset)

export const getLeaderboardLeaders = createSelector(
    [getLeaderboardLeadersState],
    (leaders) => leaders
)

// export const getLeaderboardType = createSelector([getLeaderboardTypeState], (type) => type)

export const getLeaderboardRequesting = createSelector(
    [getLeaderboardRequestingState],
    (isRequesting) => isRequesting
)
