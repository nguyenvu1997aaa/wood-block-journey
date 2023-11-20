import produce from 'immer'
import { AnyAction } from 'redux'
import { DAILY_REWARDS_RECEIVE, DAILY_REWARDS_REQUEST } from '../constants/ActionTypes'

const initState: IDailyRewardsState = {
    rewards: [],
    isRequesting: false,
}

export default (state = initState, action: AnyAction) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { rewards } = payload

        switch (action.type) {
            case DAILY_REWARDS_REQUEST:
                draft.isRequesting = true
                break

            case DAILY_REWARDS_RECEIVE:
                draft.isRequesting = false
                draft.rewards = rewards
                break

            default:
        }
    })
