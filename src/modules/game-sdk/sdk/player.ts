abstract class Player implements GameSDK.Player {
    /**
     * A unique identifier for the player. A Facebook user's player ID will remain constant,
     * and is scoped to a specific game. This means that different games will have different
     * player IDs for the same user. This function should not be called until GameSDK.initializeAsync()
     * has resolved.
     *
     * @returns A unique identifier for the player.
     */
    public abstract getID(): string | null

    /**
     * A unique identifier for the player. This is the standard Facebook Application-Scoped ID
     * which is used for all Graph API calls. If your game shares an AppID with a native game
     * this is the ID you will see in the native game too.
     *
     * @returns A unique identifier for the player.
     */
    public abstract getASIDAsync(): Promise<string | null>

    public abstract getSignedASIDAsync(): Promise<GameSDK.SignedASID | null>

    /**
     * Fetch the player's unique identifier along with a signature that verifies that the identifier indeed
     * comes from Facebook without being tampered with. This function should not be called until
     * GameSDK.initializeAsync() has resolved.
     *
     * @param requestPayload  A developer-specified payload to include in the signed response.
     * @returns A promise that resolves with a SignedPlayerInfo object.
     * @throws INVALID_PARAM
     * @throws NETWORK_FAILURE
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract getSignedPlayerInfoAsync(
        requestPayload?: string
    ): Promise<GameSDK.SignedPlayerInfo>

    /**
     * Returns a promise that resolves with whether the player can subscribe to the game bot or not.
     * Developer can only call subscribeBotAsync() after checking canSubscribeBotAsync(), and the player will
     * only be able to see this bot subscription dialog once for a specific game.
     *
     * @returns Whether a player can subscribe to the game bot or not.
     */
    public abstract canSubscribeBotAsync(): Promise<boolean>

    /**
     * Request that the player subscribe the bot associated to the game. The API will reject if the subscription
     * fails - else, the player will subscribe the game bot.
     *
     * @returns A promise that resolves if player successfully subscribed to the game bot, or rejects if request failed or player chose to not subscribe.
     * @throws INVALID_PARAM
     * @throws PENDING_REQUEST
     * @throws CLIENT_REQUIRES_UPDATE
     */
    public abstract subscribeBotAsync(): Promise<void>

    /**
     * The player's localized display name. This function should not be called until GameSDK.startGameAsync() has resolved.
     *
     * @returns The player's localized display name.
     */
    public abstract getName(): string | null

    /**
     * A url to the player's public profile photo. The photo will always be a square, and with dimensions of at least 200x200.
     * When rendering it in the game, the exact dimensions should never be assumed to be constant. It's recommended to always
     * scale the image to a desired size before rendering. The value will always be null until GameSDK.startGameAsync() resolves.
     *
     * WARNING: Due to CORS, using these photos in the game canvas can cause it to be tainted, which will prevent the canvas data from being extracted.
     * To prevent this, set the cross-origin attribute of the images you use to 'anonymous'.
     *
     * @returns Url to the player's public profile photo.
     */
    public abstract getPhoto(): string | null

    /**
     * Retrieve data from the designated cloud storage of the current player.
     *
     * @param keys An array of unique keys to retrieve data for.
     * @returns A promise that resolves with an object which contains the current key-value pairs for each key specified in the input array, if they exist.
     * @throws INVALID_PARAM
     * @throws NETWORK_FAILURE
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract getDataAsync(keys: string[]): Promise<GameSDK.DataObject>

    /**
     * Set data to be saved to the designated cloud storage of the current player. The game can store up to 1MB of data for each unique player.
     *
     * @param data An object containing a set of key-value pairs that should be persisted to cloud storage. The object must contain only serializable
     * values - any non-serializable values will cause the entire modification to be rejected.
     * @returns A promise that resolves when the input values are set. NOTE: The promise resolving does not necessarily mean that the input has already been persisted.
     * Rather, it means that the data was valid and has been scheduled to be saved. It also guarantees that all values that were set are now available in player.getDataAsync.
     * @throws INVALID_PARAM
     * @throws NETWORK_FAILURE
     * @throws PENDING_REQUEST
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract setDataAsync(data: GameSDK.DataObject): Promise<void>

    /**
     * Immediately flushes any changes to the player data to the designated cloud storage. This function is expensive, and should primarily be
     * used for critical changes where persistence needs to be immediate and known by the game. Non-critical changes should rely on the platform
     * to persist them in the background. NOTE: Calls to player.setDataAsync will be rejected while this function's result is pending.
     *
     * @returns  A promise that resolves when changes have been persisted successfully, and rejects if the save fails.
     * @throws INVALID_PARAM
     * @throws NETWORK_FAILURE
     * @throws PENDING_REQUEST
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract flushDataAsync(): Promise<void>

    /**
     * Fetches an array of ConnectedPlayer objects containing information about players that are connected to the current player.
     * @returns A promise that resolves with a list of connected player objects. NOTE: This promise will not resolve until GameSDK.startGameAsync() has resolved.
     * @throws NETWORK_FAILURE
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract getConnectedPlayersAsync(): Promise<GameSDK.ConnectedPlayer[]>

    public abstract isGuest(): boolean
}

export default Player
