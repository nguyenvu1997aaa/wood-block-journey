import { createSelector } from 'reselect'
import { REDUCER_NAME } from '../../constants/ReducerTypes'

const getProfilesDataState = (state: IState) => state[REDUCER_NAME].data
const getProfileIdsState = (state: IState) => state[REDUCER_NAME].profileIds

export const getProfilesData = createSelector([getProfilesDataState], (data) => data)
export const getProfileIds = createSelector([getProfileIdsState], (playerIds) => playerIds)
