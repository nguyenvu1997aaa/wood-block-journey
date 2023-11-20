import GameSDK from '../../sdk'
import FBContext from './FBContext'
import FBGraphApi from './FBGraphApi'
import FBPlayer from './FBPlayer'
import FBTournament from './FBTournament'

class FBInstantAdapter extends GameSDK {
    private sdk: typeof FBInstant

    public player: FBPlayer
    public context: FBContext
    public graphApi: FBGraphApi
    public tournament: FBTournament

    constructor(sdk: typeof FBInstant) {
        super()

        this.sdk = sdk

        this.player = new FBPlayer(sdk.player)
        this.context = new FBContext(sdk.context)
    }

    public getLocale(): string | null {
        return this.sdk.getLocale()
    }

    public getPlatform(): GameSDK.Platform | null {
        return this.sdk.getPlatform()
    }

    public getSDKVersion(): string {
        return this.sdk.getSDKVersion()
    }

    public initializeAsync(): Promise<void> {
        return this.sdk.initializeAsync()
    }

    public setLoadingProgress(progress: number): void {
        this.sdk.setLoadingProgress(progress)
    }

    public getSupportedAPIs(): string[] {
        return this.sdk.getSupportedAPIs()
    }

    public getEntryPointData(): unknown {
        return this.sdk.getEntryPointData()
    }

    public getEntryPointAsync(): Promise<string> {
        return this.sdk.getEntryPointAsync()
    }

    public setSessionData(sessionData: unknown): void {
        this.sdk.setSessionData(sessionData)
    }

    public startGameAsync(): Promise<void> {
        return this.sdk.startGameAsync()
    }

    public shareAsync(payload: GameSDK.SharePayload): Promise<void> {
        return this.sdk.shareAsync(payload)
    }

    public updateAsync(
        payload: GameSDK.CustomUpdatePayload | GameSDK.LeaderboardUpdatePayload
    ): Promise<void> {
        return this.sdk.updateAsync(payload)
    }

    public switchGameAsync(appID: string, data?: unknown): Promise<void> {
        return this.sdk.switchGameAsync(appID, data)
    }

    public canCreateShortcutAsync(): Promise<boolean> {
        return this.sdk.canCreateShortcutAsync()
    }

    public createShortcutAsync(): Promise<void> {
        return this.sdk.createShortcutAsync()
    }

    public quit(): void {
        this.sdk.quit()
    }

    public logEvent(
        eventName: string,
        valueToSum?: number,
        parameters?: { [key: string]: string }
    ): GameSDK.APIError | null {
        return this.sdk.logEvent(eventName, valueToSum, parameters)
    }

    public onPause(callback: () => void): void {
        this.sdk.onPause(callback)
    }

    public getInterstitialAdAsync(placementID: string): Promise<GameSDK.AdInstance> {
        return this.sdk.getInterstitialAdAsync(placementID)
    }

    public getRewardedVideoAsync(placementID: string): Promise<GameSDK.AdInstance> {
        return this.sdk.getRewardedVideoAsync(placementID)
    }

    public matchPlayerAsync(
        matchTag?: string,
        switchContextWhenMatched?: boolean,
        offlineMatch?: boolean
    ): Promise<void> {
        return this.sdk.matchPlayerAsync(matchTag, switchContextWhenMatched, offlineMatch)
    }

    public checkCanPlayerMatchAsync(): Promise<boolean> {
        return this.sdk.checkCanPlayerMatchAsync()
    }

    public getLeaderboardAsync(name: string): Promise<GameSDK.Leaderboard> {
        return this.sdk.getLeaderboardAsync(name)
    }

    public postSessionScoreAsync(score: number): Promise<void> {
        return this.sdk.postSessionScoreAsync(score)
    }

    public loadBannerAdAsync(placementID: string, _config: BannerAdConfig): Promise<void> {
        return this.sdk.loadBannerAdAsync(placementID)
    }

    public hideBannerAdAsync(): Promise<void> {
        return this.sdk.hideBannerAdAsync()
    }

    public async showGameRating() {
        return Promise.reject(new Error('CLIENT_UNSUPPORTED_OPERATION'))
    }

    public getTournamentAsync(): Promise<GameSDK.Tournament> {
        return this.sdk.getTournamentAsync()
    }

    public inviteAsync(payload: GameSDK.InvitePayload): Promise<void> {
        return this.sdk.inviteAsync(payload)
    }

    public shareLinkAsync(payload: GameSDK.LinkSharePayload): Promise<void> {
        return this.sdk.shareLinkAsync(payload)
    }

    public submitGameResultsAsync(_score: number): Promise<boolean> {
        return Promise.reject(new Error('CLIENT_UNSUPPORTED_OPERATION'))
    }

    public scheduleNotificationAsync(
        _payload?: DeepPartial<$msstart.NotificationData>
    ): Promise<void> {
        return Promise.reject(new Error('CLIENT_UNSUPPORTED_OPERATION'))
    }
}

export default FBInstantAdapter
