import { MISSION_COMPLETED, MISSION_START, MISSION_UPDATE } from '../constants/ActionTypes'

export const startMission = (name: string) => ({
    type: MISSION_START,
    payload: { name },
})

export const updateMission = (name: string, type: string, value: number) => ({
    type: MISSION_UPDATE,
    payload: { name, type, value },
})

export const finishMission = (name: string) => ({
    type: MISSION_COMPLETED,
    payload: { name },
})
