import { SCENE_KEY_UPDATE } from '@/constants/ActionTypes'
import produce from 'immer'
import type { AnyAction } from 'redux'

const initState: ISceneState = {
    currentSceneKey: '',
    prevSceneKey: '',
}

export default (state = initState, action: AnyAction) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { sceneKey } = payload

        switch (action.type) {
            case SCENE_KEY_UPDATE:
                draft.currentSceneKey = sceneKey
                draft.prevSceneKey = state.currentSceneKey
                break

            default:
        }
    })
