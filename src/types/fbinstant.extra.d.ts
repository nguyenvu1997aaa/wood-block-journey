interface IFBInstantExtra {
    switchAsync(contextId: string): Promise<void>
    chooseAsync(): Promise<string | null | boolean>
    createAsync(playerId: string): Promise<string | null | boolean>
    getPlayerToken(): Promise<string>
    getContextPlayers(skipPlayerId: string): Promise<TPlayer[]>
    shareAsync(payload: GameSDK.SharePayload): Promise<void>
    inviteAsync(payload: GameSDK.MessagePayload): Promise<void>
    sendMessage(payload: GameSDK.MessagePayload): Promise<void>
    postSessionScoreAsync(score: number): Promise<void>
    requestTournamentAsync(score: number): Promise<void>
    matchPlayerAsync(
        matchTag?: string,
        switchContextWhenMatched?: boolean,
        offlineMatch?: boolean
    ): Promise<boolean>
    getRewardedVideoAsync(placementID: string): Promise<GameSDK.AdInstance>
    getInterstitialAdAsync(placementID: string): Promise<GameSDK.AdInstance>
    // TODO: update interface
    sendNotificationAsync(payload: FBInstant.NotificationPayload): Promise<void>
    getContextID(): string | null
    attemptToAddShortcut(): Promise<boolean>
    attemptToSubscribeBot(): Promise<boolean>
    setLoadingProgress(value: number): void
    getLocale(): string
}

declare namespace Phaser {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface FacebookInstantGamesPlugin extends IFBInstantExtra {
        tournament: FBInstant.Tournaments
        getTournamentAsync(): Promise<GameSDK.Tournament>
        progressLoading: IProgressLoading
    }
}

interface IProgressLoading {
    loadingProgressFbBootScene: Function
    finishLoadingProgressFbBootScene: Function
    loadingProgressFbLoadScene: Function
    onProgress: Function
}
