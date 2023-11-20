import { sendException } from '@/utils/Sentry'
import { AUTH_TOKEN_RECEIVED, AUTH_TOKEN_REQUEST } from '../../constants/ActionTypes'
import RequestTokenFail from '../../exceptions/RequestTokenFail'
import { getAuthRequesting, getAuthToken } from '../selectors/auth'

export const requestToken = () => async (dispatch: IDispatch, getState: IGetSate) => {
    try {
        const { facebook } = window.game
        const state = getState()

        const token = getAuthToken(state)
        const isRequesting = getAuthRequesting(state)

        if (isRequesting || token !== '') return

        dispatch({
            type: AUTH_TOKEN_REQUEST,
            payload: {},
        })

        const signedPlayer = await facebook.getPlayerToken()

        dispatch(receiveToken(signedPlayer))
    } catch (error) {
        if (error instanceof Object && GameCore.Utils.Object.hasOwn(error, 'code')) {
            if (error.code === 'PENDING_REQUEST') return
        }

        dispatch(receiveToken(''))

        if (error instanceof Object && GameCore.Utils.Object.hasOwn(error, 'message')) {
            if (typeof error.message === 'string') {
                sendException(new Error(error.message))
                return
            }
        }

        sendException(new RequestTokenFail())
    }
}

const receiveToken = (token: string) => ({
    type: AUTH_TOKEN_RECEIVED,
    payload: { token },
})
