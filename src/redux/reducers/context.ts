// ! Don't remove enableES5 and sort import
import { enableES5 } from 'immer'
enableES5()

import {
    CONTEXT_PROCESSED,
    CONTEXT_GAME_MODE_DETECTED,
    CONTEXT_RECEIVED,
} from '@/constants/ActionTypes'
import produce from 'immer'
import type { AnyAction } from 'redux'

const initState: IContextState = {
    processed: false,
    contextId: '',
    contextType: 'SOLO',
    entryPointData: {},
    currentGameMode: '',
}

export const initContextState = initState

export default (state = initState, action: AnyAction) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { gameMode, contextId, contextType, entryPointData } = payload

        switch (action.type) {
            case CONTEXT_RECEIVED:
                draft.contextId = contextId
                draft.contextType = contextType
                draft.entryPointData = entryPointData
                break

            case CONTEXT_PROCESSED:
                draft.contextId = contextId
                draft.contextType = contextType
                draft.processed = true
                break

            case CONTEXT_GAME_MODE_DETECTED:
                draft.currentGameMode = gameMode
                break

            default:
        }
    })
