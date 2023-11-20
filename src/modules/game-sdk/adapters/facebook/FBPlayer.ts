import Player from '../../sdk/player'

class FBPlayer extends Player {
    private sdk: GameSDK.Player

    constructor(sdk: GameSDK.Player) {
        super()
        this.sdk = sdk
    }

    public getID(): string | null {
        return this.sdk.getID()
    }

    public getASIDAsync(): Promise<string | null> {
        return this.sdk.getASIDAsync()
    }

    public getSignedASIDAsync(): Promise<GameSDK.SignedASID | null> {
        return this.sdk.getSignedASIDAsync()
    }

    public getName(): string | null {
        return this.sdk.getName()
    }

    public getPhoto(): string | null {
        return this.sdk.getPhoto()
    }

    public getDataAsync(keys: string[]): Promise<GameSDK.DataObject> {
        return this.sdk.getDataAsync(keys)
    }

    public setDataAsync(data: GameSDK.DataObject): Promise<void> {
        return this.sdk.setDataAsync(data)
    }

    public flushDataAsync(): Promise<void> {
        return this.sdk.flushDataAsync()
    }

    public getSignedPlayerInfoAsync(requestPayload?: string): Promise<GameSDK.SignedPlayerInfo> {
        return this.sdk.getSignedPlayerInfoAsync(requestPayload)
    }

    public canSubscribeBotAsync(): Promise<boolean> {
        return this.sdk.canSubscribeBotAsync()
    }

    public subscribeBotAsync(): Promise<void> {
        return this.sdk.subscribeBotAsync()
    }

    public getConnectedPlayersAsync(): Promise<GameSDK.ConnectedPlayer[]> {
        return this.sdk.getConnectedPlayersAsync()
    }

    public isGuest(): boolean {
        return false
    }
}

export default FBPlayer
