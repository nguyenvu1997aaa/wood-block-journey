import Context from './context'
import GraphApi from './graphApi'
import Payments from './payments'
import Player from './player'
import Tournament from './tournament'

abstract class GameSDK {
    /**
     * Contains functions and properties related to the current player.
     */
    public abstract player: Player

    /**
     * Contains functions and properties related to the current game context.
     */
    public abstract context: Context

    public abstract graphApi: GraphApi

    public abstract tournament: Tournament

    /**
     * Contains functions and properties related to payments and purchases of game products.
     */
    public payments: Payments

    /**
     * The current locale. Use this to determine what language the current game should be localized with.
     * The value will not be accurate until GameSDK.startGameAsync() resolves.
     *
     * @returns The current locale.
     */
    public getLocale(): string | null {
        return null
    }

    /**
     * The platform on which the game is currently running. The value will always be null until GameSDK.initializeAsync() resolves.
     */
    public getPlatform(): GameSDK.Platform | null {
        return null
    }

    /**
     * The string representation of this SDK version.
     *
     * @returns The SDK version.
     */
    public getSDKVersion(): string {
        return '0.0'
    }

    /**
     * Initializes the SDK library. This should be called before any other SDK functions.
     *
     * @returns A promise that resolves when the SDK is ready to use.
     * @throws INVALID_OPERATION
     */
    public abstract initializeAsync(): Promise<void>

    /**
     * Report the game's initial loading progress.
     *
     * @param percentage A number between 0 and 100.
     */
    public abstract setLoadingProgress(percentage: number): void

    /**
     * Provides a list of API functions that are supported by the client.
     *
     * @returns List of API functions that the client explicitly supports.
     */
    public getSupportedAPIs(): string[] {
        return []
    }

    /**
     * Returns any data object associated with the entry point that the game was launched from.
     *
     * The contents of the object are developer-defined, and can occur from entry points on different platforms.
     * This will return null for older mobile clients, as well as when there is no data associated with the particular entry point.
     *
     * @returns Data associated with the current entry point.
     */
    public getEntryPointData(): unknown {
        return null
    }

    /**
     * Returns the entry point that the game was launched from.
     * This function should be called after GameSDK.startGameAsync() resolves.
     *
     * @returns The name of the entry point from which the user started the game.
     */
    public getEntryPointAsync(): Promise<string> {
        return new Promise((resolve) => {
            resolve('')
        })
    }

    /**
     * Sets the data associated with the individual gameplay session for the current context.
     *
     * This function should be called whenever the game would like to update the current session data.
     * This session data may be used to populate a variety of payloads, such as game play webhooks.
     *
     * @param sessionData An arbitrary data object, which must be less than or equal to 1000 characters when stringified.
     */
    public abstract setSessionData(sessionData: unknown): void

    /**
     * This indicates that the game has finished initial loading and is ready to start.
     * Context information will be up-to-date when the returned promise resolves.
     *
     * @returns A promise that resolves when the game should start.
     * @throws INVALID_PARAM
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract startGameAsync(): Promise<void>

    /**
     * This invokes a dialog to let the user share specified content, either as a message in Messenger or as a post on the user's timeline.
     * A blob of data can be attached to the share which every game session launched from the share will be able to access from GameSDK.getEntryPointData().
     * This data must be less than or equal to 1000 characters when stringified. The user may choose to cancel the share action and close the dialog, and the
     * returned promise will resolve when the dialog is closed regardless if the user actually shared the content or not.
     *
     * @param payload Specify what to share. See example for details.
     * @returns A promise that resolves when the share is completed or cancelled.
     * @throws INVALID_PARAM
     * @throws NETWORK_FAILURE
     * @throws PENDING_REQUEST
     * @throws CLIENT_UNSUPPORTED_OPERATION
     * @throws INVALID_OPERATION
     */
    public abstract shareAsync(payload: GameSDK.SharePayload): Promise<void>

    /**
     * Informs Facebook of an update that occurred in the game. This will temporarily yield control to Facebook and Facebook will decide what to do based on what the update is.
     * The returned promise will resolve/reject when Facebook returns control to the game.
     *
     * @param payload A payload that describes the update.
     * @returns A promise that resolves when Facebook gives control back to the game.
     * @throws INVALID_PARAM
     * @throws PENDING_REQUEST
     * @throws INVALID_OPERATION
     */
    public abstract updateAsync(
        payload: GameSDK.CustomUpdatePayload | GameSDK.LeaderboardUpdatePayload
    ): Promise<void>

    /**
     * Request that the client switch to a different Instant Game. The API will reject if the switch fails - else, the client will load the new game.
     *
     * @param appID The Application ID of the Instant Game to switch to. The application must be an Instant Game, and must belong to the same business as the current game.
     * To associate different games with the same business, you can use Business Manager: https://developers.facebook.com/docs/apps/business-manager#update-business.
     * @param data An optional data payload. This will be set as the entrypoint data for the game being switched to. Must be less than or equal to 1000 characters when stringified.
     * @throws USER_INPUT
     * @throws INVALID_PARAM
     * @throws PENDING_REQUEST
     * @throws CLIENT_REQUIRES_UPDATE
     */
    public abstract switchGameAsync(appID: string, data?: unknown): Promise<void>

    /**
     * Returns whether or not the user is eligible to have shortcut creation requested.
     *
     * Will return false if createShortcutAsync was already called this session or the user is ineligible for shortcut creation.
     *
     * @returns Promise that resolves with true if the game can request the player create a shortcut to the game, and false otherwise
     * @throws PENDING_REQUEST
     * @throws CLIENT_REQUIRES_UPDATE
     * @throws INVALID_OPERATION
     */
    public canCreateShortcutAsync(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'))
        })
    }

    /**
     * Prompts the user to create a shortcut to the game if they are eligible to Can only be called once per session. (see canCreateShortcutAsync)
     * @throws USER_INPUT
     * @throws PENDING_REQUEST
     * @throws CLIENT_REQUIRES_UPDATE
     * @throws INVALID_OPERATION
     */
    public abstract createShortcutAsync(): Promise<void>

    /**
     * Quits the game.
     */
    public quit(): void {
        //
    }

    /**
     * Log an app event with FB Analytics. See https://developers.facebook.com/docs/javascript/reference/v2.8#app_events for more details about FB Analytics.
     *
     * @param eventName Name of the event. Must be 2 to 40 characters, and can only contain '_', '-', ' ', and alphanumeric characters.
     * @param valueToSum An optional numeric value that FB Analytics can calculate a sum with.
     * @param parameters An optional object that can contain up to 25 key-value pairs to be logged with the event. Keys must be 2 to 40 characters,
     * and can only contain '_', '-', ' ', and alphanumeric characters. Values must be less than 100 characters in length.
     * @returns The error if the event failed to log; otherwise returns null.
     */
    public abstract logEvent(
        eventName: string,
        valueToSum?: number,
        parameters?: { [key: string]: string }
    ): GameSDK.APIError | null

    /**
     * Set a callback to be fired when a pause event is triggered.
     * @param callback A function to call when a pause event occurs.
     */
    public abstract onPause(callback: () => void): void

    /**
     * Attempt to create an instance of interstitial ad. This instance can then be preloaded and presented.
     * @param placementID The placement ID that's been setup in your Audience Network settings.
     * @returns A promise that resolves with a AdInstance, or rejects with a APIError if it couldn't be created.
     * @throws ADS_TOO_MANY_INSTANCES
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract getInterstitialAdAsync(placementID: string): Promise<GameSDK.AdInstance>

    /**
     * Attempt to create an instance of rewarded video. This instance can then be preloaded and presented.
     * @param placementID The placement ID that's been setup in your Audience Network settings.
     * @returns A promise that resolves with a AdInstance, or rejects with a APIError if it couldn't be created.
     * @throws ADS_TOO_MANY_INSTANCES
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract getRewardedVideoAsync(placementID: string): Promise<GameSDK.AdInstance>

    /**
     * Attempts to match the current player with other users looking for people to play with. If successful, a new Messenger group
     * thread will be created containing the matched players and the player will be context switched to that thread.
     * The default minimum and maximum number of players in one matched thread are 2 and 20 respectively, depending on how many players
     * are trying to get matched around the same time. The values can be changed in fbapp-config.json. See the
     * [Bundle Config documentation]https://developers.facebook.com/docs/games/instant-games/bundle-config for documentation about fbapp-config.json.
     *
     * @param matchTag Optional extra information about the player used to group them with similar players. Players will only be grouped with other players with exactly the same tag.
     * The tag must only include letters, numbers, and underscores and be 100 characters or less in length.
     * @param switchContextWhenMatched Optional extra parameter that specifies whether the player should be immediately switched to the new context when a match is found.
     * By default this will be false which will mean the player needs explicitly press play after being matched to switch to the new context.
     * @param offlineMatch Optional extra parameter that specifies whether to start a match asynchronously. By default this will be false which means the game will start a match synchronously.
     * @returns A promise that resolves when the player has been added to a group thread and switched into the thread's context.
     * @throws INVALID_PARAM
     * @throws NETWORK_FAILURE
     * @throws USER_INPUT
     * @throws PENDING_REQUEST
     * @throws CLIENT_UNSUPPORTED_OPERATION
     * @throws INVALID_OPERATION
     */
    public abstract matchPlayerAsync(
        matchTag?: string,
        switchContextWhenMatched?: boolean,
        offlineMatch?: boolean
    ): Promise<void>

    /**
     * Checks if the current player is eligible for the matchPlayerAsync API.
     * @returns  A promise that resolves with true if the player is eligible to match with other players and false otherwise.
     * @throws NETWORK_FAILURE
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract checkCanPlayerMatchAsync(): Promise<boolean>

    /**
     * Fetch a specific leaderboard belonging to this Instant Game.
     *
     * @param name The name of the leaderboard. Each leaderboard for an Instant Game must have its own distinct name.
     * @returns A promise that resolves with the matching leaderboard, rejecting if one is not found.
     * @throws LEADERBOARD_NOT_FOUND
     * @throws NETWORK_FAILURE
     * @throws CLIENT_UNSUPPORTED_OPERATION
     * @throws INVALID_OPERATION
     * @throws INVALID_PARAM
     */
    public abstract getLeaderboardAsync(name: string): Promise<GameSDK.Leaderboard>

    /**
     * Attempt to load or re-load a banner ad.
     *
     * @param placementID string The placement ID that's been set up in your Audience Network settings.
     * @returns Promise A promise that resolves after loading a banner ad, or rejects with a #apierror if it couldn't be created.
     *
     * @throws RATE_LIMITED
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract loadBannerAdAsync(placementID: string, _config: BannerAdConfig): Promise<void>

    /**
     * Attempt to hide a banner ad.
     *
     * @returns Promise A promise that resolves after the ad is hidden.
     *
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract hideBannerAdAsync(): Promise<void>

    public abstract getTournamentAsync(): Promise<GameSDK.Tournament>

    public abstract inviteAsync(payload: GameSDK.InvitePayload): Promise<void>

    public performHapticFeedbackAsync(): Promise<void> {
        return Promise.resolve()
    }

    public abstract shareLinkAsync(payload: GameSDK.LinkSharePayload): Promise<void>

    public abstract submitGameResultsAsync(score: number): Promise<boolean>
    public abstract scheduleNotificationAsync(
        payload?: DeepPartial<$msstart.NotificationData>
    ): Promise<void>
}

export default GameSDK
