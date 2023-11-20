import Context from '../../sdk/context'

class FBContext extends Context {
    private sdk: GameSDK.Context

    constructor(sdk: GameSDK.Context) {
        super()

        this.sdk = sdk
    }

    public getID(): string | null {
        return this.sdk.getID()
    }

    public getType(): GameSDK.Type {
        return this.sdk.getType()
    }

    public isSizeBetween(min: number, max: number): GameSDK.ContextSizeResponse | null {
        return this.sdk.isSizeBetween(min, max)
    }

    public switchAsync(id: string): Promise<void> {
        return this.sdk.switchAsync(id)
    }

    public chooseAsync(options?: GameSDK.ContextOptions): Promise<void> {
        return this.sdk.chooseAsync(options)
    }

    public createAsync(playerID: string): Promise<void> {
        return this.sdk.createAsync(playerID)
    }

    public getPlayersAsync(): Promise<GameSDK.ContextPlayer[]> {
        return this.sdk.getPlayersAsync()
    }
}

export default FBContext
