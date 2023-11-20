import { merge } from 'merge-anything'
import produce from 'immer'
import {
    MATCH_CHALLENGE_DATA_RECEIVED,
    MATCH_ONLINE_DATA_RECEIVED,
    MATCH_ONLINE_STATS_UPDATE,
    MATCH_STATS_CONTEXT_RECEIVED,
    MATCH_STATS_CONTEXT_REQUEST,
    MATCH_STATS_CURRENT_UPDATE,
    MATCH_STATS_DATA_CLEAR,
    MATCH_STATS_DATA_UPDATE,
} from '../constants/ActionTypes'

const initState = {
    current: {
        updateAt: 0,
    },
    data: {
        updateAt: 0,
    },
    isRequesting: false,
}

export default (state = initState, action) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { playerId, stats, match, current, players, leaders } = payload

        switch (action.type) {
            case MATCH_STATS_DATA_CLEAR:
                delete draft.data[playerId]
                draft.current = initState.current
                break

            case MATCH_STATS_CONTEXT_REQUEST:
                draft.data = initState.data
                draft.isRequesting = true
                break

            case MATCH_STATS_CONTEXT_RECEIVED:
                draft.data = stats
                draft.isRequesting = false
                break

            case MATCH_STATS_DATA_UPDATE:
                draft.data[playerId] = stats
                break

            case MATCH_STATS_CURRENT_UPDATE:
                draft.current = merge({ ...state.current }, stats)
                break

            case MATCH_ONLINE_DATA_RECEIVED:
                Object.keys(players).forEach((playerId) => {
                    draft.data[playerId] = { score: 0 }
                })
                break

            case MATCH_ONLINE_STATS_UPDATE:
                leaders.forEach((leader) => {
                    const { playerId, score, rank } = leader
                    draft.data[playerId] = { score, rank }
                })
                break

            case MATCH_CHALLENGE_DATA_RECEIVED:
                {
                    const {
                        blackPlayerId,
                        blackPlayerScore,
                        whitePlayerId,
                        whitePlayerScore,
                        whitePlayerLevel,
                        blackPlayerLevel,
                    } = match || {}

                    if (!blackPlayerId || !whitePlayerId) break

                    if (current) {
                        draft.current = current
                    }

                    draft.data[blackPlayerId] = { score: blackPlayerScore, level: blackPlayerLevel }
                    draft.data[whitePlayerId] = { score: whitePlayerScore, level: whitePlayerLevel }
                }
                break
        }
    })
