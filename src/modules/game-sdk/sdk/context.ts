abstract class Context implements GameSDK.Context {
    /**
     * A unique identifier for the current game context. This represents a specific context that the game is being played in
     * (for example, a particular messenger conversation or facebook post). The identifier will be null if game is being played in
     * a solo context. This function should not be called until GameSDK.startGameAsync has resolved.
     *
     * @returns A unique identifier for the current game context.
     */
    public getID(): string | null {
        return null
    }

    /**
     * The type of the current game context. POST - A facebook post. THREAD - A messenger thread.
     * GROUP - A facebook group. SOLO - Default context, where the player is the only participant.
     * This function should not be called until GameSDK.startGameAsync has resolved.
     *
     * @returns Type of the current game context
     */
    public getType(): GameSDK.Type {
        return 'SOLO'
    }

    /**
     * This function determines whether the number of participants in the current game context is between a given minimum and maximum, inclusive.
     * If one of the bounds is null only the other bound will be checked against. It will always return the original result for the first call made in
     * a context in a given game play session. Subsequent calls, regardless of arguments, will return the answer to the original query until a context
     * change occurs and the query result is reset. This function should not be called until GameSDK.startGameAsync has resolved.
     * This will be null if one or both of the supplied arguments are not valid, if we do not have a size available for the current context,
     * or if the API is called before startGameAsync() resolves.
     *
     * @param minSize The minimum bound of the context size query.
     * @param maxSize The maximum bound of the context size query.
     * @returns ContextSizeResponse
     */
    public abstract isSizeBetween(
        minSize?: number,
        maxSize?: number
    ): GameSDK.ContextSizeResponse | null

    /**
     * Request a switch into a specific context. If the player does not have permission to enter that context,
     * or if the player does not provide permission for the game to enter that context,
     * this will reject. Otherwise, the promise will resolve when the game has switched into the specified context.
     *
     * @param id ID of the desired context.
     * @returns A promise that resolves when the game has switched into the specified context, or rejects otherwise.
     * @throws INVALID_PARAM
     * @throws SAME_CONTEXT
     * @throws NETWORK_FAILURE
     * @throws USER_INPUT
     * @throws PENDING_REQUEST
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract switchAsync(id: string): Promise<void>

    /**
     * Opens a context selection dialog for the player. If the player selects an available context, the client will attempt to switch into that context,
     * and resolve if successful. Otherwise, if the player exits the menu or the client fails to switch into the new context, this function will reject.
     *
     * @param options An object specifying conditions on the contexts that should be offered.
     * @returns A promise that resolves when the game has switched into the context chosen by the user. Otherwise, the promise will reject (if the user cancels out of the dialog, for example).
     * @throws INVALID_PARAM
     * @throws SAME_CONTEXT
     * @throws NETWORK_FAILURE
     * @throws USER_INPUT
     * @throws PENDING_REQUEST
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract chooseAsync(options?: GameSDK.ContextOptions): Promise<void>

    /**
     * Attempts to create or switch into a context between a specified player and the current player. The returned promise will reject if the player listed is not a Connected Player of the current
     * player or if the player does not provide permission to enter the new context. Otherwise, the promise will resolve when the game has switched into the new context.
     *
     * @param playerID ID of the player
     * @returns A promise that resolves when the game has switched into the new context, or rejects otherwise.
     * @throws INVALID_PARAM
     * @throws SAME_CONTEXT
     * @throws NETWORK_FAILURE
     * @throws USER_INPUT
     * @throws PENDING_REQUEST
     * @throws CLIENT_UNSUPPORTED_OPERATION
     */
    public abstract createAsync(playerID: string): Promise<void>

    /**
     * Gets an array of ContextPlayer objects containing information about active players — people who actively played the game in the current context in the last 90 days.
     * This may include the current player.
     * @throws NETWORK_FAILURE
     * @throws CLIENT_UNSUPPORTED_OPERATION
     * @throws INVALID_OPERATION
     */
    public abstract getPlayersAsync(): Promise<GameSDK.ContextPlayer[]>
}

export default Context
