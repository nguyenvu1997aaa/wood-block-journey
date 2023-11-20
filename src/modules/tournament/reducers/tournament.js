import produce from 'immer'
import {
    TOURNAMENT_ACTIVE,
    TOURNAMENT_RECEIVED,
    TOURNAMENT_REQUEST,
} from '../constants/ActionTypes'

const initState = {
    active: false,
    tournamentId: null,
    bestSessionScore: 0,
    isRequesting: false,
}

export default (state = initState, action) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { score = 0, tournamentId } = payload

        switch (action.type) {
            case TOURNAMENT_ACTIVE:
                draft.active = true
                draft.tournamentId = tournamentId
                break

            case TOURNAMENT_REQUEST:
                draft.isRequesting = true
                break

            case TOURNAMENT_RECEIVED:
                {
                    draft.isRequesting = false
                    if (score > state.bestSessionScore) {
                        draft.bestSessionScore = score
                    }
                }
                break
        }
    })
