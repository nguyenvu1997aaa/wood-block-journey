import { MESSAGES_SENT_REMOVE, MESSAGES_SENT_UPDATE } from '@/constants/ActionTypes'
import produce from 'immer'
import type { AnyAction } from 'redux'

const initState: IMessagesState = {
    data: {},
}

export default (state = initState, action: AnyAction) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { opponentId } = payload
        if (typeof opponentId !== 'string') return

        switch (action.type) {
            case MESSAGES_SENT_UPDATE:
                if (state.data[opponentId]) {
                    draft.data[opponentId].sent = true
                } else {
                    draft.data[opponentId] = { sent: true }
                }
                break

            case MESSAGES_SENT_REMOVE:
                if (state.data[opponentId]) {
                    draft.data[opponentId].sent = false
                } else {
                    draft.data[opponentId] = { sent: false }
                }
                break
        }
    })
