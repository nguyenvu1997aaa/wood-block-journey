import { createSelector } from 'reselect'
import { REDUCER_NAME } from '../constants/ReducerTypes'

const getDailyRewardsDataState = (state: IState) => state[REDUCER_NAME]?.rewards
const getDailyRewardsRequestingState = (state: IState) => state[REDUCER_NAME]?.isRequesting

export const getDailyRewardsData = createSelector([getDailyRewardsDataState], (rewards) => rewards)

export const getDailyRewardsRequesting = createSelector(
    [getDailyRewardsRequestingState],
    (isRequesting) => isRequesting
)
