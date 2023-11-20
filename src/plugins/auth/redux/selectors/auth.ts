import { createSelector } from 'reselect'
import { REDUCER_NAME } from '../../constants/ReducerTypes'

const getAuthTokenState = (state: IState) => state[REDUCER_NAME].token
const getAuthRequestingState = (state: IState) => state[REDUCER_NAME].isRequesting

export const getAuthToken = createSelector([getAuthTokenState], (auth) => auth)
export const getAuthRequesting = createSelector(
    [getAuthRequestingState],
    (isRequesting) => isRequesting
)
