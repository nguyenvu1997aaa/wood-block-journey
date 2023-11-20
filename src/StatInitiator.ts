import ContextDtos from '@/dtos/Context'
import InvalidPlayerId from '@/modules/match/exceptions/InvalidPlayerId'
import PlayerDtos from '@/plugins/player/dtos/Player'
import { contextReceived } from '@/redux/actions/context'
import PlayerDataKeys from './constants/PlayerDataKeys'
import FacebookPlayerDataDtos from './dtos/FacebookPlayerData'

const { SyncProfileFromAPI } = GameCore.Configs

class StateInitiator implements IStateInitiator {
    private game: Phaser.Game

    constructor(game: Phaser.Game) {
        this.game = game
    }

    public initContext = (): void => {
        const contextIdRaw = window.GameSDK.context.getID()
        const contextTypeRaw = window.GameSDK.context.getType()
        const entryPointDataRaw = window.GameSDK.getEntryPointData()

        const context = new ContextDtos(contextIdRaw, contextTypeRaw, entryPointDataRaw)
        const { contextId, contextType, entryPointData } = context.toObject()

        this.game.storage.dispatch(contextReceived(contextId, contextType, entryPointData))
    }

    public initPlayer = async (): Promise<void> => {
        const { player } = this.game

        const playerInfo = this.getPlayerInfo()

        const dataKeys = Object.values(PlayerDataKeys)
        const rawData = await FBInstant.player.getDataAsync(dataKeys)
        console.info('🚀 > rawData', rawData)

        let playerData = new FacebookPlayerDataDtos(rawData)
        console.info('🚀 > playerData', playerData)

        // ? Yandex don't use API to save player data
        // playerData = await this.syncDataFromAPI(playerData)

        // ? Maintain data structure here
        playerData = await this.maintainDataStructure(playerData)

        const data = playerData.toObject()
        if (data.settings.music === true) {
            window.game.audio.playMusic()
        }

        await player.receiveData(playerInfo, playerData.convertToPlayerData())
    }

    /* private syncDataFromAPI = async (
        playerData: FacebookPlayerDataDtos
    ): Promise<FacebookPlayerDataDtos> => {
        try {
            if (!SyncProfileFromAPI) return playerData

            const data = (await FBInstant.player.getDataAsync(['isSynced'])) || {}
            const isSynced = data['isSynced'] || false

            if (isSynced === true) return playerData

            const playerInfo = this.getPlayerInfo()
            const playerId = window.FBInstant.player.getID()

            if (playerInfo.playerId !== playerId) return playerData

            //? new user still receive data from host API
            //? and flow will process to set isSynced = true in below codes
            const profile = (await updatePlayerProfileAsync({
                appId: AppId,
                playerId,
                name: playerInfo.name,
                photo: playerInfo.photo,
                locale: playerInfo.locale,
            })) as TObject

            const apiData = new PlayerDataLocalDtos(profile).toObject()
            const currentData = playerData.toObject()

            
            // ! Please check whether apiData and currentData is needed to be merged
            debugger

            const fbPlayerData = new FacebookPlayerDataDtos({}).convertToFacebookData(apiData)

            FBInstant.player.setDataAsync({
                ...fbPlayerData,
                isSynced: true,
            })

            return new FacebookPlayerDataDtos(fbPlayerData)
        } catch (error) {
            console.warn(error)
            return playerData
        }
    } */

    // ? convert customFields to gameData for some old version
    private maintainDataStructure = async (
        playerData: FacebookPlayerDataDtos
    ): Promise<FacebookPlayerDataDtos> => {
        try {
            if (!SyncProfileFromAPI) return playerData

            const data = (await FBInstant.player.getDataAsync(['isSynced', 'customFields'])) || {}
            const isSynced = data['isSynced'] || false

            if (isSynced === true) return playerData

            const customFields = data['customFields'] || false

            if (!customFields) return playerData

            const currentData = playerData.convertToPlayerData()

            // ? Please check currentData is new version or not
            currentData.customFields = customFields

            const fbPlayerData = new FacebookPlayerDataDtos({}).convertToFacebookData(currentData)

            await FBInstant.player.setDataAsync({
                ...fbPlayerData,
                isSynced: true,
            })

            return new FacebookPlayerDataDtos(fbPlayerData)
        } catch (error) {
            console.warn(error)
            return playerData
        }
    }

    private getPlayerInfo = (): TPlayer => {
        try {
            // ? Don't use phaser fbinstant in here

            const playerId = window.GameSDK.player.getID()
            let playerName = window.GameSDK.player.getName()
            const playerPhoto = window.GameSDK.player.getPhoto()
            const playerLocale = window.GameSDK.getLocale()

            if (!GameCore.Utils.Valid.isString(playerId)) {
                throw new InvalidPlayerId(null, { playerId })
            }

            if (!GameCore.Utils.Valid.isString(playerName)) {
                playerName = 'You'
            }

            return new PlayerDtos(playerId, playerName, playerPhoto, playerLocale).toObject()
        } catch (error) {
            // console.warn(error)
            return new PlayerDtos('123', 'You').toObject()
        }
    }

    /* private getPlayerDataLocal = (): IPlayerData | null => {
        try {
            const data = getByKeyLocalStorage(PlayerDataStore)

            if (!GameCore.Utils.Valid.isObject(data)) return null

            return new PlayerDataLocalDtos(data).toObject()
        } catch (error) {
            console.warn(error)
            return null
        }
    } */
}

export default StateInitiator
