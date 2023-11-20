import FacebookPlayerDataDtos from '@/dtos/FacebookPlayerData'
import { sendException } from '@/utils/Sentry'
import { increaseUserGuideDisplays, updatePlayerProfileAsync } from '../../api/player'
import {
    PLAYER_CONNECTED_PLAYERS_UPDATE,
    PLAYER_DATA_UPDATE,
    PLAYER_PROFILE_UPDATE,
    PLAYER_RECEIVED,
    PLAYER_SCORE_UPDATE,
    PLAYER_SETTING_UPDATE,
} from '../../constants/ActionTypes'
import PlayerDtos from '../../dtos/Player'
import PlayerDataNameNotSupport from '../../exceptions/PlayerDataNameNotSupport'
import { getPlayer, getPlayerData, getPlayerId } from '../selectors/player'

const { AppId, Tutorial } = GameCore.Configs

export const playerReceived =
    (playerInfo: TPlayer, playerData: IPlayerData | null) => (dispatch: IDispatch) => {
        const { playerId, name, photo, locale } = playerInfo
        const data = playerData || {}

        dispatch({
            type: PLAYER_RECEIVED,
            payload: { playerId, name, photo, locale, data },
        })
    }

export const requestConnectedPlayers = () => async (dispatch: IDispatch) => {
    try {
        const { facebook } = window.game

        const players: GameSDK.ConnectedPlayer[] = await new Promise((resolve, reject) => {
            facebook.once('players', (players: GameSDK.ConnectedPlayer[]) => {
                resolve(players)
            })

            facebook.once('playersfail', () => reject([]))

            facebook.getPlayers()
        })

        const isPlayer = (player: TPlayer | null): player is TPlayer => {
            return !!player
        }

        const connectedPlayers = players
            .map((player) => {
                const playerId = player.getID()
                const name = player.getName()
                const photo = player.getPhoto()

                if (!playerId || !name || !photo) return null

                return new PlayerDtos(playerId, name, photo).toObject()
            })
            .filter(isPlayer)

        if (connectedPlayers.length < 1) return

        dispatch(updateConnectedPlayers(connectedPlayers))
    } catch (error) {
        sendException(error)
    }
}

export const updateConnectedPlayers = (connectedPlayers: TPlayer[]) => ({
    type: PLAYER_CONNECTED_PLAYERS_UPDATE,
    payload: { connectedPlayers },
})

export const updateSetting =
    (name: string, value: unknown) =>
    async (dispatch: IDispatch, getState: IGetSate): Promise<void> => {
        try {
            await dispatch({
                type: PLAYER_SETTING_UPDATE,
                payload: { name, value },
            })

            const state = getState()
            const playerData = getPlayerData(state)

            const fbPlayerData = new FacebookPlayerDataDtos({}).convertToFacebookData(playerData)
            FBInstant.player.setDataAsync(fbPlayerData)
        } catch (error) {
            sendException(error)
        }
    }

export const updatePlayerProfile =
    () =>
    async (dispatch: IDispatch, getState: IGetSate): Promise<void> => {
        try {
            const state = getState()

            // Sync player data with local data
            const player = getPlayer(state)
            const { playerId, name, photo, locale } = player

            const ASID = await FBInstant.player.getASIDAsync()

            const profile = {
                appId: AppId,
                playerId,
                name,
                photo,
                locale,
                ASID,
            }

            await dispatch({
                type: PLAYER_PROFILE_UPDATE,
                payload: { profile },
            })

            await updatePlayerProfileAsync(profile)
        } catch (error) {
            sendException(error)
        }
    }

export const setPlayerCustomData =
    (name: string, data: unknown) =>
    async (dispatch: IDispatch, getState: IGetSate): Promise<void> => {
        try {
            const custom = { customFields: { [name]: data } }

            await dispatch(updatePlayerData(custom))

            const state = getState()
            const playerData = getPlayerData(state)

            // updatePlayerProfileAsync(playerData)

            const fbPlayerData = new FacebookPlayerDataDtos({}).convertToFacebookData(playerData)
            FBInstant.player.setDataAsync(fbPlayerData)
        } catch (error) {
            if (error instanceof PlayerDataNameNotSupport) return
            sendException(error)
        }
    }

export const setMultiCustomData =
    (customFields: TObject) =>
    async (dispatch: IDispatch, getState: IGetSate): Promise<void> => {
        try {
            const custom = { customFields }

            await dispatch(updatePlayerData(custom))

            const state = getState()
            const playerData = getPlayerData(state)

            // updatePlayerProfileAsync(playerData)

            const fbPlayerData = new FacebookPlayerDataDtos({}).convertToFacebookData(playerData)
            FBInstant.player.setDataAsync(fbPlayerData)
        } catch (error) {
            console.log('🤖 ? error', error)
            if (error instanceof PlayerDataNameNotSupport) return
            sendException(error)
        }
    }

const updatePlayerData = (data: TObject) => ({
    type: PLAYER_DATA_UPDATE,
    payload: { data },
})

export const incUserGuideDisplays =
    () =>
    async (dispatch: IDispatch, getState: IGetSate): Promise<void> => {
        try {
            if (Tutorial.ForceUseTutorial) return

            await dispatch(updatePlayerData({ userGuideDisplays: 1 }))

            const state = getState()
            const playerId = getPlayerId(state)
            const playerData = getPlayerData(state)

            const fbPlayerData = new FacebookPlayerDataDtos({}).convertToFacebookData(playerData)
            FBInstant.player.setDataAsync(fbPlayerData)

            increaseUserGuideDisplays(playerId)
        } catch (error) {
            sendException(error)
        }
    }

export const setPlayerBestScore =
    (score: number) =>
    async (dispatch: IDispatch, getState: IGetSate): Promise<void> => {
        try {
            await dispatch({
                type: PLAYER_SCORE_UPDATE,
                payload: { score },
            })

            //? push score to api for profile best score
            updatePlayerProfileAsync({ score })

            const state = getState()
            const playerData = getPlayerData(state)
            const fbPlayerData = new FacebookPlayerDataDtos({}).convertToFacebookData(playerData)
            FBInstant.player.setDataAsync(fbPlayerData)
        } catch (error) {
            sendException(error)
        }
    }
