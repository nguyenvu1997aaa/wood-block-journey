import produce from 'immer'
import { merge } from 'merge-anything'
import type { AnyAction } from 'redux'
import { PROFILES_DATA_UPDATE } from '../../constants/ActionTypes'

const initState: IProfileState = {
    data: {},
    profileIds: [],
}

export default (state = initState, action: AnyAction) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { data = [] } = payload

        switch (action.type) {
            case PROFILES_DATA_UPDATE:
                {
                    const profiles = GameCore.Utils.Object.keyBy(data, 'playerId')
                    const profileIds = Object.keys(profiles)

                    // @ts-expect-error is valid
                    draft.data = merge({ ...state.data }, profiles)

                    draft.profileIds = [...new Set([...state.profileIds, ...profileIds])]
                }
                break
        }
    })
