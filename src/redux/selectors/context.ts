import { createSelector } from 'reselect'

const getContextState = (state: IState) => state.context
const getCurrentGameModeState = (state: IState) => state.context.currentGameMode

export const getContext = createSelector([getContextState], (context) => context)

export const getCurrentGameMode = createSelector(
    [getCurrentGameModeState],
    (currentGameMode) => currentGameMode
)
