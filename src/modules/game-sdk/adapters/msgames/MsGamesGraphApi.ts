import GraphApi from '../../sdk/graphApi'

class MsGamesGraphApi extends GraphApi {
    public async requestAsync(): Promise<unknown> {
        return Promise.reject(new Error('Unsupported'))
    }

    public async initPlatformAsync(): Promise<unknown> {
        return Promise.reject(new Error('Unsupported'))
    }

    public async getPlayerASIDAsync(): Promise<string> {
        return Promise.reject(new Error('Unsupported'))
    }
}

export default MsGamesGraphApi
