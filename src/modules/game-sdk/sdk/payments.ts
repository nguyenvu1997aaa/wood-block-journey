class Payments implements GameSDK.Payments {
    /**
     * Fetches the game's product catalog.
     *
     * @returns The set of products that are registered to the game.
     * @throws CLIENT_UNSUPPORTED_OPERATION
     * @throws PAYMENTS_NOT_INITIALIZED
     * @throws NETWORK_FAILURE
     */
    public getCatalogAsync(): Promise<GameSDK.Product[]> {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'))
        })
    }

    /**
     * Begins the purchase flow for a specific product. Will immediately reject if called before GameSDK.startGameAsync() has resolved.
     *
     * @param purchaseConfig The purchase's configuration details.
     * @returns A Promise that resolves when the product is successfully purchased by the player. Otherwise, it rejects.
     * @throws CLIENT_UNSUPPORTED_OPERATION
     * @throws PAYMENTS_NOT_INITIALIZED
     * @throws INVALID_PARAM
     * @throws NETWORK_FAILURE
     * @throws INVALID_OPERATION
     */
    public purchaseAsync(_purchaseConfig: GameSDK.PurchaseConfig): Promise<GameSDK.Purchase> {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'))
        })
    }

    /**
     * Fetches all of the player's unconsumed purchases. As a best practice, the game should fetch the current player's purchases
     * as soon as the client indicates that it is ready to perform payments-related operations. The game can then process and consume
     * any purchases that are waiting to be consumed.
     *
     * @returns The set of purchases that the player has made for the game.
     * @throws CLIENT_UNSUPPORTED_OPERATION
     * @throws PAYMENTS_NOT_INITIALIZED
     * @throws NETWORK_FAILURE
     */
    public getPurchasesAsync(): Promise<GameSDK.Purchase[]> {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'))
        })
    }

    /**
     * Consumes a specific purchase belonging to the current player. Before provisioning a product's effects to the player,
     * the game should request the consumption of the purchased product. Once the purchase is successfully consumed, the game
     * should immediately provide the player with the effects of their purchase.
     *
     * @param purchaseToken The purchase token of the purchase that should be consumed.
     * @throws CLIENT_UNSUPPORTED_OPERATION
     * @throws PAYMENTS_NOT_INITIALIZED
     * @throws INVALID_PARAM
     * @throws NETWORK_FAILURE
     */
    public consumePurchaseAsync(_purchaseToken: string): Promise<void> {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'))
        })
    }

    /**
     * Sets a callback to be triggered when Payments operations are available.
     * @param callback The callback function to be executed when Payments are available.
     */
    public onReady(_callback: () => void): void {
        //
    }
}

export default Payments
