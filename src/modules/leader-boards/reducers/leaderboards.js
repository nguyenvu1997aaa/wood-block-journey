import produce from 'immer'
import {
    LEADERBOARD_DATA_CLEAR,
    LEADERBOARD_DATA_REQUEST,
    LEADERBOARD_DATA_UPDATE,
} from '../constants/ActionTypes'

const initState = {
    leaderboardId: '',
    type: '',
    limit: 0,
    offset: 0,
    leaders: {},
    isRequesting: false,
}

export default (state = initState, action) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { leaderboardId, type, limit, offset, leaders } = payload

        switch (action.type) {
            case LEADERBOARD_DATA_REQUEST:
                if (state.type !== type && offset === 0) {
                    draft.leaders = initState.leaders
                }
                draft.isRequesting = true
                draft.leaderboardId = leaderboardId
                draft.type = type
                draft.limit = limit
                draft.offset = offset
                break

            case LEADERBOARD_DATA_UPDATE:
                {
                    draft.isRequesting = false

                    if (state.type !== type) break

                    const leadersData = GameCore.Utils.Json.clone({ ...state.leaders, ...leaders })

                    const leadersList = Object.values(leadersData)

                    const leaderFiltered = leadersList.map((leader) => {
                        if (!(!!leader.name && !!leader.photo)) {
                            leader.name = 'Unknown'
                            leader.photo = ''
                        }
                        return leader
                    })
                    leaderFiltered.sort((a, b) => +b.score - +a.score)

                    leaderFiltered.forEach((leader, index) => {
                        leader.rank = index + 1

                        if (!state.leaders[leader.playerId]) {
                            draft.leaders[leader.playerId] = leader
                        }
                    })
                }
                break

            case LEADERBOARD_DATA_CLEAR:
                draft.isRequesting = false
                draft.type = initState.type
                draft.limit = initState.limit
                draft.offset = initState.offset
                draft.leaders = initState.leaders
                draft.leaderboardId = initState.leaderboardId
                break
        }
    })
