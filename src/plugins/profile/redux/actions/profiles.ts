import { sendException } from '@/utils/Sentry'
import { getPlayersAsync } from '../../api/profiles'
import { PROFILES_DATA_UPDATE } from '../../constants/ActionTypes'
import { getProfileIds } from '../selectors/profiles'

export const requestProfileData =
    (playerIds: string[]) => async (dispatch: IDispatch, getState: IGetSate) => {
        try {
            const state = getState()
            const profileIds = getProfileIds(state)
            const needPlayerIds = GameCore.Utils.Array.difference(playerIds, profileIds)

            if (needPlayerIds.length < 1) return

            const data = await getPlayersAsync({ playerIds: needPlayerIds })

            dispatch({
                type: PROFILES_DATA_UPDATE,
                payload: { data },
            })
        } catch (error) {
            sendException(error)
        }
    }
