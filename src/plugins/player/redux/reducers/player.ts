import produce from 'immer'
import {
    PLAYER_CONNECTED_PLAYERS_UPDATE,
    PLAYER_DATA_UPDATE,
    PLAYER_SETTING_UPDATE,
    PLAYER_RECEIVED,
    PLAYER_SCORE_UPDATE,
    PLAYER_PROFILE_UPDATE,
} from '../../constants/ActionTypes'
import { merge } from 'merge-anything'
import type { AnyAction } from 'redux'
import { defaultSettings } from '../../constants/DefaultSettings'

const initState: IPlayerState = {
    ASID: '',
    playerId: '',
    name: '',
    photo: '',
    locale: '',
    connectedPlayers: {},
    data: {
        score: 0,
        settings: defaultSettings,
        userGuideDisplays: 0,
        customFields: {},
    },
    isUserNew: true,
}

export const IPlayerState = initState

export default (state = initState, action: AnyAction) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { name, value, data = {}, score, connectedPlayers = [], profile } = payload

        switch (action.type) {
            case PLAYER_RECEIVED:
                {
                    const { playerId, name, photo, locale, data } = payload

                    draft.playerId = playerId
                    draft.name = name
                    draft.photo = photo
                    draft.locale = locale

                    if (GameCore.Utils.Valid.isObject(data)) {
                        const playerData = data as IPlayerData
                        draft.data = merge(state.data, playerData)
                    }

                    if (data.userGuideDisplays > 0) {
                        draft.isUserNew = false
                    }
                }
                break

            case PLAYER_PROFILE_UPDATE:
                {
                    const { playerId, name, photo, locale, ASID } = profile

                    draft.ASID = ASID
                    draft.playerId = playerId
                    draft.name = name
                    draft.photo = photo
                    draft.locale = locale
                }
                break

            case PLAYER_SCORE_UPDATE:
                draft.data.score = score
                break

            case PLAYER_SETTING_UPDATE:
                if (!GameCore.Utils.Object.hasOwn(draft.data.settings, name)) break
                draft.data.settings[name] = value
                break

            case PLAYER_DATA_UPDATE:
                draft.data = merge(state.data, data) as IPlayerData

                if (data.userGuideDisplays > 0) {
                    draft.isUserNew = false
                }
                break

            case PLAYER_CONNECTED_PLAYERS_UPDATE:
                {
                    if (connectedPlayers.length <= 0) break

                    const connectedPlayersKeyed = GameCore.Utils.Object.keyBy(
                        connectedPlayers,
                        'playerId'
                    ) as IPlayers
                    draft.connectedPlayers = merge(state.connectedPlayers, connectedPlayersKeyed)
                }
                break
        }
    })
