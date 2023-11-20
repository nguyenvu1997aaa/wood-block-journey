import { createSelector } from 'reselect'
import { REDUCER_NAME } from '../constants/ReducerTypes'

const getMissionNameProps = (state: unused, props: TObject) => props.name

const getMissionsDataState = (state: IState) => state[REDUCER_NAME]?.missions
const getMissionsRequestingState = (state: IState) => state[REDUCER_NAME]?.isRequesting

export const getMissionsData = createSelector([getMissionsDataState], (missions) => missions)

export const getMissionsRequesting = createSelector(
    [getMissionsRequestingState],
    (isRequesting) => isRequesting
)

export const getMissionData = createSelector(
    [getMissionsData, getMissionNameProps],
    (missions, name) => {
        if (!missions) return null
        if (typeof name !== 'string') return null

        if (GameCore.Utils.Object.hasOwn(missions, name)) {
            return missions[name]
        }

        return null
    }
)
