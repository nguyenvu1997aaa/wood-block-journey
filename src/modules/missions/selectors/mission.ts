import { createSelector } from 'reselect'
import { REDUCER_NAME } from '../constants/ReducerTypes'

const getCurrentMissionState = (state: IState) => state[REDUCER_NAME]?.mission

export const getCurrentMission = createSelector([getCurrentMissionState], (mission) => mission)

export const getCurrentMissionId = createSelector([getCurrentMission], (mission) =>
    mission ? mission.name : null
)
