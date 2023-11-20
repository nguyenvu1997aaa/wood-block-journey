import produce from 'immer'
import {
    MATCH_CHALLENGE_CREATE_REQUEST,
    MATCH_CHALLENGE_DATA_CLEAR,
    MATCH_CHALLENGE_DATA_RECEIVED,
    MATCH_CHALLENGE_FINISH_REQUEST,
    MATCH_CHALLENGE_JOIN_REQUEST,
    MATCH_SINGLE_CREATE_REQUEST,
    MATCH_SINGLE_DATA_CLEAR,
    MATCH_SINGLE_DATA_RECEIVED,
    MATCH_SINGLE_DETAIL_REQUEST,
    MATCH_SINGLE_MOVE_UPDATED,
    MATCH_ONLINE_CREATE_REQUEST,
    MATCH_GROUP_FINISH_REQUEST,
    MATCH_GROUP_CREATE_REQUEST,
    MATCH_ONLINE_FINISH_REQUEST,
    MATCH_CHALLENGE_CONTINUE_REQUEST,
    MATCH_ONLINE_DATA_RECEIVED,
    MATCH_ONLINE_DATA_CLEAR,
    MATCH_JOURNEY_DATA_CLEAR,
    MATCH_JOURNEY_DATA_RECEIVED,
    MATCH_JOURNEY_MOVE_UPDATED,
    MATCH_JOURNEY_CREATE_REQUEST,
    MATCH_JOURNEY_DAILY_CHALLENGE_START,
    MATCH_JOURNEY_DAILY_CHALLENGE_COMPLETED,
    MATCH_JOURNEY_SCORE_RECEIVED,
    MATCH_JOURNEY_LEVEL_RECEIVED,
} from '../constants/ActionTypes'
import {
    MATCH_STATUS_ACTIVE,
    MATCH_STATUS_FINISHED,
    MATCH_STATUS_OPEN,
} from '../constants/MatchStatus'

const initState = {
    single: {
        _id: '',
        data: {
            fen: '',
        },
        playerId: '',
        status: MATCH_STATUS_OPEN,
    },
    group: {
        status: MATCH_STATUS_OPEN,
        opponentInfo: {
            playerId: '',
            name: '',
            photo: '',
        },
    },
    challenge: {
        _id: '',
        status: MATCH_STATUS_OPEN,
        whitePlayerId: '',
        blackPlayerId: '',
        opponentInfo: {
            playerId: '',
            name: '',
            photo: '',
        },
    },
    online: {
        _id: '',
        status: MATCH_STATUS_OPEN,
        players: {},
    },
    journey: {
        _id: '',
        data: {
            fen: '',
        },
        playerId: '',
        status: MATCH_STATUS_OPEN,
        challengeMode: false,
    },
    updateAt: 0,
    isRequesting: false,
}

export default (state = initState, action) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { match, opponentInfo, players, score, level } = payload

        switch (action.type) {
            case MATCH_SINGLE_CREATE_REQUEST:
            case MATCH_SINGLE_DETAIL_REQUEST:
            case MATCH_CHALLENGE_JOIN_REQUEST:
            case MATCH_CHALLENGE_FINISH_REQUEST:
            case MATCH_ONLINE_CREATE_REQUEST:
            case MATCH_JOURNEY_CREATE_REQUEST:
                draft.isRequesting = true
                break

            case MATCH_SINGLE_MOVE_UPDATED:
                draft.single = { ...state.single, ...match }
                draft.updateAt = Date.now()
                break

            case MATCH_JOURNEY_MOVE_UPDATED:
                draft.journey = { ...state.journey, ...match }
                draft.updateAt = Date.now()
                break

            case MATCH_JOURNEY_DAILY_CHALLENGE_START:
                draft.journey.challengeMode = true
                break

            case MATCH_JOURNEY_DAILY_CHALLENGE_COMPLETED:
                draft.journey.challengeMode = false
                break

            case MATCH_SINGLE_DATA_RECEIVED:
                draft.isRequesting = false
                draft.single = match || initState.single
                break

            case MATCH_JOURNEY_DATA_RECEIVED:
                draft.isRequesting = false
                draft.journey = match || initState.journey
                break

            case MATCH_JOURNEY_SCORE_RECEIVED:
                draft.journey.score = score
                break

            case MATCH_JOURNEY_LEVEL_RECEIVED:
                draft.journey.level = level
                break

            case MATCH_SINGLE_DATA_CLEAR:
                draft.isRequesting = false
                draft.single = initState.single
                break

            case MATCH_JOURNEY_DATA_CLEAR:
                draft.isRequesting = false
                draft.journey = initState.journey
                break

            case MATCH_CHALLENGE_CREATE_REQUEST:
            case MATCH_CHALLENGE_CONTINUE_REQUEST:
                draft.isRequesting = true
                draft.challenge.opponentInfo = opponentInfo
                break

            case MATCH_CHALLENGE_DATA_RECEIVED:
                draft.isRequesting = false
                draft.challenge = { ...(match || initState.challenge) }
                draft.challenge.opponentInfo = state.challenge.opponentInfo
                break

            case MATCH_CHALLENGE_DATA_CLEAR:
                draft.isRequesting = false
                draft.challenge = initState.challenge
                break

            case MATCH_GROUP_CREATE_REQUEST:
                draft.group.status = MATCH_STATUS_ACTIVE
                if (opponentInfo) {
                    draft.group.opponentInfo = opponentInfo
                }
                break

            case MATCH_GROUP_FINISH_REQUEST:
                draft.group.status = MATCH_STATUS_FINISHED
                break

            case MATCH_ONLINE_DATA_CLEAR:
                draft.online.status = initState.online.status
                draft.online.players = initState.online.players
                break

            case MATCH_ONLINE_DATA_RECEIVED:
                draft.online.status = MATCH_STATUS_ACTIVE
                draft.online.players = players
                break

            case MATCH_ONLINE_FINISH_REQUEST:
                draft.online.status = MATCH_STATUS_FINISHED
                break
        }
    })
