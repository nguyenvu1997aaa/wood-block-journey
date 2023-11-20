import { defaultSettings } from '@/plugins/player/constants/DefaultSettings'
import PlayerSettingsDtos from '@/plugins/player/dtos/PlayerSettings'

const { Valid, Object: ObjectUtils } = GameCore.Utils

/**
 * If you want to add new fields to gameData,
 * remember to modify `updateGameData`, `convertToPlayerData`, `convertToFacebookData` method
 *
 * If you want to add new fields to global,
 * remember to modify all `methods`.
 * Also modify `PlayerDataLocal.ts` and player `reducer` files
 */
class FacebookPlayerDataDtos {
    private score: FacebookPlayerData['score']
    private settings: FacebookPlayerData['settings']
    private gameData: FacebookPlayerData['gameData']
    private userGuideDisplays: FacebookPlayerData['userGuideDisplays']

    constructor(data: FBInstant.DataObject) {
        this.setupDefaultData()

        this.updateScore(data)
        this.updateSettings(data)
        this.updateGameData(data)
        this.updateUserGuideDisplays(data)
    }

    private setupDefaultData() {
        this.score = 0

        this.settings = { ...defaultSettings }

        this.gameData = {
            coins: 0,
            diamond: 0,
            lastReceiveGift: 0,
            dailyRewarded: {
                lastRewarded: 0,
                logDays: [],
            },
            dailyTasks: {
                startedTime: 0,
                logTasks: {},
            },
        }

        this.userGuideDisplays = 0
    }

    private updateScore(data: FBInstant.DataObject) {
        const { score } = data

        if (Valid.isNumber(score) === false) return

        this.score = score
    }

    private updateSettings(data: FBInstant.DataObject) {
        const { settings } = data

        if (Valid.isObject(settings) === false) return

        const correctSettings = new PlayerSettingsDtos(settings).toObject()
        this.settings = correctSettings
    }

    private updateGameData(data: FBInstant.DataObject) {
        const { gameData } = data

        if (Valid.isObject(gameData) === false) return

        if (ObjectUtils.hasOwn(gameData, 'coins')) {
            if (Valid.isNumber(gameData.coins)) {
                this.gameData.coins = gameData.coins
            }
        }

        if (ObjectUtils.hasOwn(gameData, 'diamond')) {
            if (Valid.isNumber(gameData.diamond)) {
                this.gameData.diamond = gameData.diamond
            }
        }

        if (ObjectUtils.hasOwn(gameData, 'lastReceiveGift')) {
            if (Valid.isNumber(gameData.lastReceiveGift)) {
                this.gameData.lastReceiveGift = gameData.lastReceiveGift
            }
        }

        if (ObjectUtils.hasOwn(gameData, 'dailyRewarded')) {
            if (Valid.isObject(gameData.dailyRewarded)) {
                const dailyRewarded =
                    gameData.dailyRewarded as FacebookPlayerData['gameData']['dailyRewarded']

                if (ObjectUtils.hasOwn(dailyRewarded, 'lastRewarded')) {
                    if (Valid.isNumber(dailyRewarded.lastRewarded)) {
                        this.gameData.dailyRewarded.lastRewarded = dailyRewarded.lastRewarded
                    }
                }

                if (ObjectUtils.hasOwn(dailyRewarded, 'logDays')) {
                    if (Array.isArray(dailyRewarded.logDays)) {
                        this.gameData.dailyRewarded.logDays = dailyRewarded.logDays
                    }
                }
            }
        }

        if (ObjectUtils.hasOwn(gameData, 'dailyTasks')) {
            if (Valid.isObject(gameData.dailyTasks)) {
                const dailyTasks =
                    gameData.dailyTasks as FacebookPlayerData['gameData']['dailyTasks']

                if (ObjectUtils.hasOwn(dailyTasks, 'startedTime')) {
                    if (Valid.isNumber(dailyTasks.startedTime)) {
                        this.gameData.dailyTasks.startedTime = dailyTasks.startedTime
                    }
                }

                if (ObjectUtils.hasOwn(dailyTasks, 'logTasks')) {
                    if (Valid.isObject(dailyTasks.logTasks)) {
                        this.gameData.dailyTasks.logTasks = dailyTasks.logTasks
                    }
                }
            }
        }
    }

    private updateUserGuideDisplays(data: FBInstant.DataObject) {
        const { userGuideDisplays } = data
        if (Valid.isNumber(userGuideDisplays) === false) return

        this.userGuideDisplays = userGuideDisplays
    }

    public toObject() {
        return {
            score: this.score,
            settings: this.settings,
            gameData: this.gameData,
            userGuideDisplays: this.userGuideDisplays,
        }
    }

    public convertToPlayerData(): IPlayerData {
        const { coins, diamond, dailyTasks, dailyRewarded, lastReceiveGift } = this.gameData

        return {
            score: this.score,
            settings: this.settings,
            customFields: {
                coins,
                diamond,
                dailyTasks,
                dailyRewarded,
                lastReceiveGift,
            },
            userGuideDisplays: this.userGuideDisplays,
        }
    }

    public convertToFacebookData(data: IPlayerData): FBInstant.DataObject {
        const { score, settings, customFields, userGuideDisplays } = data

        this.updateScore({ score })
        this.updateSettings({ settings })
        this.updateGameData({ gameData: customFields })
        this.updateUserGuideDisplays({ userGuideDisplays })

        return this.toObject()
    }
}

export default FacebookPlayerDataDtos
