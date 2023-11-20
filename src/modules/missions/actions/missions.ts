import { getMissionsDataAsync } from '../api/missions'
import { MISSIONS_DATA_RECEIVE, MISSIONS_DATA_REQUEST } from '../constants/ActionTypes'
import { getMissionsRequesting } from '../selectors/missions'

export const requestMissionsData = () => async (dispatch: Function, getState: Function) => {
    const state = getState()

    const isRequesting = getMissionsRequesting(state)
    if (isRequesting) return

    dispatch({
        type: MISSIONS_DATA_REQUEST,
        payload: {},
    })

    const missions = await getMissionsDataAsync()

    // @ts-expect-error is valid
    dispatch(receiveMissionsData(missions))
}

export const receiveMissionsData = (missions: IMissionsData) => ({
    type: MISSIONS_DATA_RECEIVE,
    payload: { missions },
})
