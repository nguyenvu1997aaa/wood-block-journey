import produce from 'immer'
import {
    LIVES_COUNT_DOWN_START,
    LIVES_REQUEST,
    LIVES_RESET,
    LIVES_UPDATED,
} from '../constants/ActionTypes'

const initState = {
    isRequesting: false,
    lives: 0,
    lastBonusLifeTime: 0,
    countDownStartAt: 0,
}

export default (state = initState, action) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { data } = payload

        switch (action.type) {
            case LIVES_REQUEST:
                draft.isRequesting = true
                break

            case LIVES_UPDATED:
                draft.isRequesting = false
                draft.lives = data.lives
                draft.lastBonusLifeTime = data.lastBonusLifeTime
                break

            case LIVES_RESET:
                draft.isRequesting = false
                draft.lives = initState.lives
                draft.lastBonusLifeTime = initState.lastBonusLifeTime
                draft.countDownStartAt = 0
                break

            case LIVES_COUNT_DOWN_START:
                draft.countDownStartAt = new Date().getTime()
                break
        }
    })
