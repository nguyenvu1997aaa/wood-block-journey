import Player from '../../sdk/player'
import Guest from './commons/Guest'
import MsGamesUser from './commons/MsGamesUser'

class MsGamesPlayer extends Player {
    private sdk: typeof $msstart
    private player: $msstart.Player

    private signature = ''

    constructor(sdk: typeof $msstart) {
        super()
        this.sdk = sdk
    }

    public async initPlayerAsync(): Promise<void> {
        const user = await this.tryGettingSignedInPlayer()

        // TODO: create a button to sign in
        // if (user === null) {
        //     user = await this.tryMakingPlayerSignedIn()
        // }

        if (user === null) {
            this.player = new Guest()
            return Promise.resolve()
        } else {
            this.player = new MsGamesUser(user)
            this.signature = user.signature
        }

        return Promise.resolve()
    }

    private async tryGettingSignedInPlayer(): Promise<$msstart.PlayerInfo | null> {
        let user = null
        try {
            user = await this.sdk.getSignedInUserAsync()
        } catch (e) {
            //
        }

        return Promise.resolve(user)
    }

    private async tryMakingPlayerSignedIn(): Promise<$msstart.PlayerInfo | null> {
        let user = null
        try {
            user = await this.sdk.signInAsync()
        } catch (e) {
            //
        }

        return Promise.resolve(user)
    }

    private rejectPlayerNotInitialized(): Promise<never> {
        return Promise.reject(new Error('Player is not initialized'))
    }

    public getID(): string | null {
        return this.player?.getUniqueID() ?? null
    }

    public getASIDAsync(): Promise<string> {
        return Promise.resolve(this.getID() ?? '')
    }

    public getSignedASIDAsync(): Promise<GameSDK.SignedASID> {
        return Promise.resolve({
            getASID: () => {
                return this.getID() ?? ''
            },
            getSignature: () => {
                return this.signature
            },
        })
    }

    public getName(): string | null {
        const name = this.player?.getName() ?? null

        return name === '' ? 'Anonymous' : name
    }

    public getPhoto(): string | null {
        return this.player?.getPhoto() ?? null
    }

    public getDataAsync(keys?: string[]): Promise<GameSDK.DataObject> {
        return new Promise((resolve, reject) => {
            this.validateIsLogged(reject)

            this.player.getData(keys).then(resolve).catch(reject)
        })
    }

    public setDataAsync(data: GameSDK.DataObject): Promise<void> {
        return new Promise((resolve, reject) => {
            this.validateIsLogged(reject)

            this.getDataAsync()
                .then((oldData) => {
                    const correctData = { ...oldData, ...data }
                    this.player
                        .setData(correctData)
                        .then(() => {
                            resolve()
                        })
                        .catch(reject)
                })
                .catch(reject)
        })
    }

    public flushDataAsync(): Promise<void> {
        return this.player?.setData({}).then() ?? this.rejectPlayerNotInitialized()
    }

    public getSignedPlayerInfoAsync(): Promise<GameSDK.SignedPlayerInfo> {
        return Promise.resolve({
            getPlayerID: (): string => {
                return this.getID() ?? '10'
            },
            getSignature: (): string => {
                return this.signature
            },
        })
    }

    public canSubscribeBotAsync(): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(false)
        })
    }

    public subscribeBotAsync(): Promise<void> {
        return new Promise((_, reject) => {
            reject(new Error('Unsupported'))
        })
    }

    public getStatsAsync(keys?: string[]): Promise<GameSDK.StatsObject> {
        return new Promise((resolve, reject) => {
            this.validateIsLogged(reject)

            resolve(this.player.getStats(keys))
        })
    }

    public setStatsAsync(stats: GameSDK.StatsObject): Promise<void> {
        return new Promise((resolve, reject) => {
            this.validateIsLogged(reject)

            this.player
                .setStats(stats)
                .then(() => resolve())
                .catch(reject)
        })
    }

    public incrementStatsAsync(increments: GameSDK.IncrementObject): Promise<GameSDK.StatsObject> {
        return new Promise((resolve, reject) => {
            this.validateIsLogged(reject)

            this.player.incrementStats(increments).then(resolve).catch(reject)
        })
    }

    public getConnectedPlayersAsync(): Promise<GameSDK.ConnectedPlayer[]> {
        return new Promise((_, reject) => {
            reject(new Error('Unsupported'))
        })
    }

    public isGuest(): boolean {
        if (!this.player) return true

        const mode = this.player.getMode()
        if (mode === 'lite') return true

        const id = this.getID()
        if (!id) return true

        return id.slice(0, 5) == 'GUEST'
    }

    private validateIsLogged(reject: Function): void {
        if (!this.player) {
            reject(new Error('Player is not initialized'))
            return
        }
    }
}

export default MsGamesPlayer
