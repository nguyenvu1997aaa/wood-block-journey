import produce from 'immer'
import type { AnyAction } from 'redux'
import {
    MISSIONS_DATA_RECEIVE,
    MISSIONS_DATA_REQUEST,
    MISSION_COMPLETED,
    MISSION_START,
    MISSION_UPDATE,
} from '../constants/ActionTypes'

const initState: IMissionsState = {
    mission: null,
    missions: null,
    isRequesting: false,
}

export default (state = initState, action: AnyAction) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { name, type, value, missions } = payload

        switch (action.type) {
            case MISSIONS_DATA_REQUEST:
                draft.isRequesting = true
                break

            case MISSIONS_DATA_RECEIVE:
                draft.isRequesting = false
                if (missions.length < 1) return

                draft.missions = {}
                missions.forEach((mission: IMission) => {
                    // @ts-expect-error this valid
                    draft.missions[mission.name] = mission
                })

                break

            case MISSION_START: {
                if (state.missions === null) break
                const mission = state.missions[name]

                draft.mission = {
                    name,
                    process: {},
                    require: mission.require,
                    reward: mission.reward,
                }

                Object.keys(mission.require).forEach((key) => {
                    // @ts-expect-error this valid
                    draft.mission.process[key] = 0
                })
                break
            }

            case MISSION_UPDATE:
                if (state.mission?.name !== name) break

                // @ts-expect-error this valid
                draft.mission.process[type] += value
                break

            case MISSION_COMPLETED:
                if (state.mission?.name !== name) break
                draft.mission = null
                break

            default:
        }
    })
