import { createSelector } from 'reselect'
import { getState } from './index'

const getGameplayModeState = (state) => getState(state).gameplay.mode
const getGameplayStatusState = (state) => getState(state).gameplay.status
const getGameplayRescuedState = (state) => getState(state).gameplay.rescued
const getGameplayStartAtState = (state) => getState(state).gameplay.startAt
const getGameplayFinishAtState = (state) => getState(state).gameplay.finishAt
const getGameplayShowMiniJourneyState = (state) => getState(state).gameplay.showMiniJourney

export const getGameplayMode = createSelector([getGameplayModeState], (mode) => mode)
export const getGameplayStatus = createSelector([getGameplayStatusState], (status) => status)
export const getGameplayRescued = createSelector([getGameplayRescuedState], (rescued) => rescued)
export const getGameplayStartAt = createSelector([getGameplayStartAtState], (startAt) => startAt)
export const getGameplayFinishAt = createSelector(
    [getGameplayFinishAtState],
    (finishAt) => finishAt
)
export const getGameplayShowMiniJourney = createSelector(
    [getGameplayShowMiniJourneyState],
    (showMiniJourney) => showMiniJourney
)
