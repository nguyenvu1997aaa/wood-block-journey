import { createSelector } from 'reselect'
import { getState } from './index'

const getDailyChallengeRequestingState = (state) => getState(state).isRequesting
const getDailyChallengeLeadersState = (state) => getState(state).leaders
const getDailyChallengeTimePlayState = (state) => getState(state).time

export const getDailyChallengeRequesting = createSelector(
    [getDailyChallengeRequestingState],
    (isRequesting) => isRequesting
)

export const getDailyChallengeLeaders = createSelector(
    [getDailyChallengeLeadersState],
    (leaders) => leaders
)

export const getDailyChallengeTimePlay = createSelector(
    [getDailyChallengeTimePlayState],
    (time) => time
)
