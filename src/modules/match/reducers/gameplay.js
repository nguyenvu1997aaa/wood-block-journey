import produce from 'immer'
import {
    MATCH_GAMEPLAY_FINISH,
    MATCH_GAMEPLAY_INITIALIZE,
    MATCH_GAMEPLAY_RESCUE,
    MATCH_GAMEPLAY_RESET_RESCUE,
    MATCH_GAMEPLAY_SHOW_MINI_JOURNEY,
    MATCH_GAMEPLAY_START,
    MATCH_GAMEPLAY_UPDATE,
} from '../constants/ActionTypes'
import {
    MATCH_STATUS_ACTIVE,
    MATCH_STATUS_FINISHED,
    MATCH_STATUS_OPEN,
} from '../constants/MatchStatus'

const initState = {
    mode: '',
    status: MATCH_STATUS_OPEN,
    rescued: 0,
    startAt: 0,
    finishAt: 0,
    showMiniJourney: null, // null | false | true
}

export default (state = initState, action) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { mode, status, stateShowMiniJourney, rescued } = payload

        switch (action.type) {
            case MATCH_GAMEPLAY_INITIALIZE:
                draft.status = MATCH_STATUS_OPEN
                draft.mode = initState.mode
                draft.rescued = initState.rescued
                draft.startAt = initState.startAt
                draft.finishAt = initState.finishAt
                draft.opponentInfo = initState.opponentInfo
                break

            case MATCH_GAMEPLAY_START:
                draft.mode = mode
                draft.status = MATCH_STATUS_ACTIVE
                draft.rescued = rescued
                draft.startAt = Date.now()
                break

            case MATCH_GAMEPLAY_UPDATE:
                draft.mode = typeof mode === 'string' ? mode : state.mode
                draft.status = status || state.status
                break

            case MATCH_GAMEPLAY_FINISH:
                draft.status = MATCH_STATUS_FINISHED
                draft.finishAt = Date.now()
                break

            case MATCH_GAMEPLAY_RESCUE:
                draft.rescued += 1
                break

            case MATCH_GAMEPLAY_SHOW_MINI_JOURNEY:
                draft.showMiniJourney = stateShowMiniJourney
                break

            case MATCH_GAMEPLAY_RESET_RESCUE:
                draft.rescued = 0
                break
        }
    })
