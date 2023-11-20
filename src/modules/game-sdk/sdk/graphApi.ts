abstract class GraphApi implements GameSDK.GraphApi {
    public sdk: GameSDK.GraphApi
    public constructor(sdk: GameSDK.GraphApi) {
        this.sdk = sdk
    }

    public abstract requestAsync(path: string, method?: string, params?: Object): Promise<unknown>
    public abstract initPlatformAsync(): Promise<unknown>
    public abstract getPlayerASIDAsync(): Promise<string>
}

export default GraphApi
