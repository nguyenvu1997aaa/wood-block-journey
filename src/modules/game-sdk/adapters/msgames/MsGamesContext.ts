import Context from '../../sdk/context'

class MsGamesContext extends Context {
    private sdk: typeof $msstart

    constructor(sdk: typeof $msstart) {
        super()
        this.sdk = sdk
    }

    public getID(): string | null {
        return null
    }

    public getType(): GameSDK.Type {
        return 'SOLO'
    }

    public isSizeBetween(_min: number, _max: number): GameSDK.ContextSizeResponse | null {
        return null
    }

    public switchAsync(_: string): Promise<void> {
        return new Promise((_, reject) => {
            reject(new Error('Unsupported'))
        })
    }

    public chooseAsync(): Promise<void> {
        return new Promise((_, reject) => {
            reject(new Error('Unsupported'))
        })
    }

    public createAsync(_: string): Promise<void> {
        return new Promise((_, reject) => {
            reject(new Error('Unsupported'))
        })
    }

    public getPlayersAsync(): Promise<GameSDK.ContextPlayer[]> {
        return new Promise((_, reject) => {
            reject(new Error('Unsupported'))
        })
    }
}

export default MsGamesContext
