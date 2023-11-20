import GraphApi from '../../sdk/graphApi'

class FBGraphApi extends GraphApi {
    public async requestAsync(path: string, method?: string, params?: Object): Promise<unknown> {
        return this.sdk.requestAsync(path, method, params)
    }

    public async initPlatformAsync(): Promise<unknown> {
        return this.sdk.initPlatformAsync()
    }

    public async getPlayerASIDAsync(): Promise<string> {
        return this.sdk.getPlayerASIDAsync()
    }
}

export default FBGraphApi
