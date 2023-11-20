import produce from 'immer'
import type { AnyAction } from 'redux'
import { AUTH_TOKEN_RECEIVED, AUTH_TOKEN_REQUEST } from '../../constants/ActionTypes'

const initState: IAuthState = {
    token: '',
    isRequesting: false,
}

export default (state = initState, action: AnyAction) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { token } = payload

        switch (action.type) {
            case AUTH_TOKEN_REQUEST:
                draft.isRequesting = true
                break

            case AUTH_TOKEN_RECEIVED:
                draft.token = token
                draft.isRequesting = false
                break
        }
    })
