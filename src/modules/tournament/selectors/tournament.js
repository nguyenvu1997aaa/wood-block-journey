import { createSelector } from 'reselect'

import { getState } from './index'

const getTournamentActiveState = (state) => getState(state).active
const getTournamentIdState = (state) => getState(state).tournamentId
const getTournamentBestSessionScoreState = (state) => getState(state).bestSessionScore
const getTournamentRequestingState = (state) => getState(state).isRequesting

export const getTournamentActive = createSelector([getTournamentActiveState], (active) => active)

export const getTournamentId = createSelector(
    [getTournamentIdState],
    (tournamentId) => tournamentId
)

export const getTournamentBestSessionScore = createSelector(
    [getTournamentBestSessionScoreState],
    (bestSessionScore) => bestSessionScore
)

export const getTournamentRequesting = createSelector(
    [getTournamentRequestingState],
    (isRequesting) => isRequesting
)
