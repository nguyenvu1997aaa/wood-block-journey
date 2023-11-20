import { AnalyticsEvents } from './constants/Analytics'
import LanguageAdapter from './plugins/language/LanguageAdapter'
import PlayerDtos from './plugins/player/dtos/Player'
import { checkIsToday } from './utils/DateTime'

const { Notification } = GameCore.Configs
const { GameTitle, GameImage } = Notification

export class FacebookTournament implements GameSDK.Tournaments {
    public async createAsync(
        payload: GameSDK.CreateTournamentPayload
    ): Promise<GameSDK.Tournament> {
        return await GameSDK.tournament.createAsync(payload)
    }

    public async shareAsync(payload: GameSDK.ShareTournamentPayload): Promise<void> {
        await GameSDK.tournament.shareAsync(payload)
    }

    public async joinAsync(tournamentID: string): Promise<void> {
        return await GameSDK.tournament.joinAsync(tournamentID)
    }

    public async postScoreAsync(score: number): Promise<void> {
        await GameSDK.tournament.postScoreAsync(score)
    }

    public async getTournamentsAsync(): Promise<GameSDK.Tournament[]> {
        return await GameSDK.tournament.getTournamentsAsync()
    }
}

class FBInstantExtra implements IFBInstantExtra {
    private facebook: Phaser.FacebookInstantGamesPlugin

    private isCalledSubscribeBot = false
    private isCalledCreateShortcut = false

    constructor(facebook: Phaser.FacebookInstantGamesPlugin) {
        this.facebook = facebook
    }

    // TODO: use switchContext
    public async switchAsync(contextId: string): Promise<void> {
        await GameCore.Utils.Valid.isValueChangeAsync(window.__fbGameReady, true)

        await GameSDK.context.switchAsync(contextId)
    }

    // TODO: use chooseContext
    public async chooseAsync(): Promise<string | null | boolean> {
        try {
            await GameCore.Utils.Valid.isValueChangeAsync(window.__fbGameReady, true)

            await GameSDK.context.chooseAsync({
                filters: ['INCLUDE_EXISTING_CHALLENGES'],
                minSize: 2,
                maxSize: 2,
            })

            return GameSDK.context.getID()
        } catch (error) {
            if (error instanceof Object && GameCore.Utils.Object.hasOwn(error, 'code')) {
                switch (error.code) {
                    case 'USER_INPUT':
                        return false
                    case 'SAME_CONTEXT':
                        return GameSDK.context.getID()
                }
            }

            return null
        }
    }

    // TODO: use createContext
    public async createAsync(playerId: string): Promise<string | null | boolean> {
        try {
            await GameCore.Utils.Valid.isValueChangeAsync(window.__fbGameReady, true)

            await GameSDK.context.createAsync(`${playerId}`)

            return GameSDK.context.getID()
        } catch (error) {
            if (error instanceof Object && GameCore.Utils.Object.hasOwn(error, 'code')) {
                switch (error.code) {
                    case 'USER_INPUT':
                        return false
                    case 'SAME_CONTEXT':
                        return GameSDK.context.getID()
                }
            }

            return null
        }
    }

    public async getPlayerToken(): Promise<string> {
        const signedPlayerInfo = await GameSDK.player.getSignedPlayerInfoAsync()
        return signedPlayerInfo.getSignature()
    }

    public async getContextPlayers(skipPlayerId: string): Promise<TPlayer[]> {
        try {
            const playersData = await GameSDK.context.getPlayersAsync()

            const players: TPlayer[] = []

            playersData.forEach((player) => {
                const playerId = player.getID()
                if (playerId === skipPlayerId) return

                const name = player.getName()
                if (!name) return

                const photo = player.getPhoto()

                players.push(new PlayerDtos(playerId, name, photo).toObject())
            })

            return GameCore.Utils.Array.unique(players)
        } catch (error) {
            console.warn('getPlayersAsync', { error })
            return []
        }
    }

    // TODO: use openInvite, openRequest, openChallenge
    public async shareAsync(payload: GameSDK.SharePayload): Promise<void> {
        await GameSDK.shareAsync(payload)
    }

    // TODO: use openRequest
    public async sendMessage(payload: GameSDK.CustomUpdatePayload): Promise<void> {
        const { data, image, template, cta, text } = payload

        const message: GameSDK.CustomUpdatePayload = {
            data,
            image,
            action: 'CUSTOM',
            template,
            cta,
            text,
            strategy: 'IMMEDIATE',
            notification: 'PUSH',
        }

        await GameSDK.updateAsync(message)
    }

    public async inviteAsync(payload: GameSDK.InvitePayload): Promise<void> {
        await GameSDK.inviteAsync(payload)
    }

    public async postSessionScoreAsync(score: number): Promise<void> {
        await GameSDK.postSessionScoreAsync(score)
    }

    public async getRewardedVideoAsync(placementID: string): Promise<GameSDK.AdInstance> {
        return await GameSDK.getRewardedVideoAsync(placementID)
    }

    public async getInterstitialAdAsync(placementID: string): Promise<GameSDK.AdInstance> {
        return await GameSDK.getInterstitialAdAsync(placementID)
    }

    public getContextID(): string | null {
        return GameSDK.context.getID()
    }

    public async attemptToAddShortcut(): Promise<boolean> {
        if (this.isCalledCreateShortcut) return false

        try {
            const data = (await GameSDK.player.getDataAsync(['lastCallCreateShortcut'])) || {}
            const time = data['lastCallCreateShortcut']

            if (time && checkIsToday(+time)) return false

            const today = Date.now()
            GameSDK.player.setDataAsync({ lastCallCreateShortcut: today })
            const isSupported = GameSDK.getSupportedAPIs().includes('canCreateShortcutAsync')
            if (!isSupported) return false

            const canCreateShortcut = await GameSDK.canCreateShortcutAsync()

            if (canCreateShortcut) {
                const { SHORTCUT_CREATE, SHORTCUT_CREATE_POPUP } = AnalyticsEvents
                this.isCalledCreateShortcut = true

                window.game.analytics.event(SHORTCUT_CREATE_POPUP)
                try {
                    await GameCore.Utils.Valid.isValueChangeAsync(window.__fbGameReady, true)

                    await GameSDK.createShortcutAsync()

                    window.game.analytics.event(SHORTCUT_CREATE, { success: true })
                    return true
                } catch (error) {
                    window.game.analytics.event(SHORTCUT_CREATE, { success: false })
                    return false
                }
            }

            return false
        } catch (error) {
            return false
        }
    }

    public async attemptToSubscribeBot(): Promise<boolean> {
        if (this.isCalledSubscribeBot) return false

        try {
            const isSupported = GameSDK.getSupportedAPIs().includes('player.canSubscribeBotAsync')
            if (!isSupported) return false

            const canSubscribeBot = await GameSDK.player.canSubscribeBotAsync()

            if (canSubscribeBot) {
                const data = (await GameSDK.player.getDataAsync(['lastCallSubscribeBot'])) || {}
                const time = data['lastCallSubscribeBot']

                if (time && checkIsToday(+time)) return false

                const today = Date.now()
                GameSDK.player.setDataAsync({ lastCallSubscribeBot: today })

                const { BOT_SUBSCRIBE, BOT_SUBSCRIBE_POPUP } = AnalyticsEvents
                this.isCalledSubscribeBot = true

                window.game.analytics.event(BOT_SUBSCRIBE_POPUP)

                try {
                    await GameCore.Utils.Valid.isValueChangeAsync(window.__fbGameReady, true)

                    await GameSDK.player.subscribeBotAsync()

                    window.game.analytics.event(BOT_SUBSCRIBE, { success: true })
                    return true
                } catch (error) {
                    window.game.analytics.event(BOT_SUBSCRIBE, { success: false })
                    return false
                }
            }

            return false
        } catch (error) {
            return false
        }
    }

    public async matchPlayerAsync(
        matchTag?: string,
        switchContextWhenMatched?: boolean,
        offlineMatch?: boolean
    ): Promise<boolean> {
        try {
            const isSupported = GameSDK.getSupportedAPIs().includes('checkCanPlayerMatchAsync')
            if (!isSupported) return false

            const canPlayerMatch = await GameSDK.checkCanPlayerMatchAsync()
            if (!canPlayerMatch) return false

            await GameSDK.matchPlayerAsync(matchTag, switchContextWhenMatched, offlineMatch)

            return true
        } catch (error) {
            return false
        }
    }

    public setLoadingProgress(value: number): void {
        GameSDK.setLoadingProgress(value)
    }

    public getLocale(): string {
        return LanguageAdapter.GetLangCode(GameSDK.getLocale() || 'en')
    }

    public async injectTournament(): Promise<void> {
        const { UseMock } = GameCore.Configs.Tournament

        if (UseMock) {
            const MockFacebookTournament = (await import('./mockup/MockFacebookTournament')).default
            this.facebook.tournament = new MockFacebookTournament()
        } else {
            this.facebook.tournament = new FacebookTournament()
        }

        this.facebook.getTournamentAsync = this.getTournamentAsync
        this.facebook.requestTournamentAsync = this.requestTournamentAsync
    }

    public async getTournamentAsync(): Promise<GameSDK.Tournament> {
        return await GameSDK.getTournamentAsync()
    }

    public requestTournamentAsync = async (score: number): Promise<void> => {
        try {
            await this.facebook.getTournamentAsync()
            await this.facebook.tournament.shareAsync({ score })
        } catch (error) {
            const playerName = GameSDK.player.getName()

            await this.facebook.tournament.createAsync({
                initialScore: score,
                config: { tournamentTitle: `${playerName}'s Tournament` },
            })
        }
    }

    public async sendNotificationAsync(payload: GameSDK.NotificationPayload): Promise<void> {
        try {
            console.log('🤖 ? sendNotificationAsync', payload)

            const { message, delayTime } = payload

            await FBInstant.scheduleNotificationAsync({
                title: GameTitle,
                minDelayInSeconds: delayTime,
                description: message,
            })
        } catch (error) {
            console.error('🤖 ? sendNotificationAsync', error)
        }
    }
}

export default FBInstantExtra
