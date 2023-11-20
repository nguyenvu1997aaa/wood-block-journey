namespace $msstart {
    function isInMicrosoftStart(): boolean
    function getEntryPointInfo(): EntryPointInfo
    function getLocale(): string
    function getSourceShareId(): string
    function pingAsync(): Promise<string>
    function shareAsync(shareData: ShareGameData): Promise<string>
    function promptInstallAsync(): Promise<string>
    function signInAsync(): Promise<PlayerInfo>
    function getSignedInUserAsync(): Promise<PlayerInfo>
    function loadAdsAsync(isRewardedAd = false): Promise<AdInstance>
    function showAdsAsync(instanceId: string): Promise<AdInstance>
    /**
     * @param primaryStatValue For time scores, use milliseconds.
     */
    function submitGameResultsAsync(primaryStatValue: number): Promise<boolean>
    function switchGameAsync(switchGameData: SwitchGameData): Promise<never>
    function showDisplayAdsAsync(displayAdPlacement: DisplayAdPlacement): Promise<string>
    function hideDisplayAdsAsync(): Promise<string>
    function getConsentStringAsync(): Promise<string>
    function scheduleNotificationAsync(data: NotificationData): Promise<string>

    interface EntryPointInfo {
        /**
         * A raw unique identifier for the entry point.
         */
        entryPointId: string
        /**
         * A human-friendly name for the entry point.
         */
        entryPointName: string
    }

    interface ShareGameData {
        /**
         * A title to be used in a share preview.
         */
        title: string
        /**
         * Text as a description to be used in a share preview.
         */
        text?: string
        /**
         * An image to be used in a share preview. This can either be a URL or base64 string representation of an image.
         */
        image?: string
    }

    interface PlayerInfo {
        /**
         * A unique player ID that has been generated for the player for this particular game.
         *
         * This player ID can be used to store progress, profiles or purchases for the user.
         *
         * Once the player ID is generated, it will be associated with the player and will be constant when the APIs are called for that user.
         */
        playerId: string
        /**
         * A unique player ID that is common for this player for all games of the publisher.
         *
         * For example, a player U1 playing any of the games from Publisher P1 will have the same publisher player id PPLID1.
         *
         * If the player plays a game for another publisher, a new publisher player id PPLID2 will be generated for that player.
         */
        publisherPlayerId: string
        /**
         * A Hash-based Message Authentication Code (HMAC) string that is computed using the SHA256 hash function.
         *
         * Using the "PublisherPlayerId" as the secret message and the API key (provided during the Publisher Onboarding) as the Key, we generate a message authentication code using the HMACSHA256 cryptographic hash function.
         */
        signature: string
    }

    interface AdInstance {
        /**
         * A unique id for the ad instance.
         */
        instanceId: string
        /**
         * A promise for the completion of showing the ad instance.
         *
         * `showAdsCompletedAsync` will be present only when showAds resolves.
         */
        showAdsCompletedAsync?: Promise<AdInstance>
    }

    interface SwitchGameData {
        /**
         * The id of the game to switch to.
         */
        id: string
        /**
         * The payload data we send to the game we switch to.
         */
        payloadData: Object
    }

    interface NotificationData {
        title: string
        description: string
        type: number
        imageData?: string
        payload?: string
        minDelayInSeconds?: number
        callToAction?: string
    }

    type DisplayAdPlacement =
        | 'top:728x90'
        | 'bottom:728x90'
        | 'left:300x250'
        | 'right:300x250'
        | 'topleft:300x250'
        | 'topright:300x250'
        | 'bottomleft:300x250'
        | 'bottomright:300x250'
        | 'top:320x50'
        | 'right:320x50'
        | 'bottom:320x50'
        | 'left:320x50'
        | 'left:300x600'
        | 'right:300x600'
        | 'top:970x250'
        | 'bottom:970x250'
        | 'left:160x600'
        | 'right:160x600'

    interface Player {
        _personalInfo: GameSDK.PersonalInfo
        getMode(): string
        getName(): string
        getPhoto(): string
        getUniqueID(): string
        setData(data: object, flush?: boolean): Promise<boolean>
        getData(keys?: string[]): Promise<object>
        setStats(stats: object): Promise<boolean>
        incrementStats(increments: object): Promise<GameSDK.StatsObject>
        getStats(keys?: string[]): Promise<GameSDK.StatsObject>
    }

    interface PersonalInfo {
        avatarIdHash: string
        id: string
        lang: string
        publicName: string
        uniqueID: string
        scopePermissions: ScorePerMissions
    }
}
