import produce from 'immer'
import {
    DAILY_CHALLENGE_REQUEST,
    DAILY_CHALLENGE_TIME_PLAY_UPDATE,
    DAILY_CHALLENGE_UPDATE,
} from '../constants/ActionTypes'

const initState = {
    leaders: {},
    isRequesting: false,
    time: 0,
}

export default (state = initState, action) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { leaders, time } = payload

        switch (action.type) {
            case DAILY_CHALLENGE_REQUEST:
                draft.isRequesting = true
                break

            case DAILY_CHALLENGE_UPDATE:
                draft.isRequesting = false
                draft.leaders = leaders
                break

            case DAILY_CHALLENGE_TIME_PLAY_UPDATE:
                if (draft.time > time || draft.time == 0) draft.time = time
                break
        }
    })
