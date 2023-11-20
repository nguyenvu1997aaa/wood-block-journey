const GameName = import.meta.env.SNOWPACK_PUBLIC_GAME_NAME

const guestIDStore = GameName + '_GuestID'
const guestDataStore = GameName + '_GuestData'
const guestStatsStore = GameName + 'GuestStats'

class MsGamesUser implements $msstart.Player {
    public _personalInfo: $msstart.PersonalInfo

    private _uniqueId: string
    private photo: string

    private _playerData: GameSDK.DataObject
    private _playerStats: GameSDK.StatsObject

    constructor(userInfo: $msstart.PlayerInfo) {
        this._uniqueId = userInfo.playerId
        localStorage.setItem(guestIDStore, this._uniqueId)

        this._personalInfo = {
            id: this._uniqueId,
            avatarIdHash: '0',
            lang: 'en',
            publicName: this._uniqueId,
            uniqueID: this._uniqueId,
            scopePermissions: {
                avatar: 'forbid',
                public_name: 'forbid',
            },
        }
        this._playerData = this.getDataFromLocalStorage()
        this._playerStats = this.getStatsFromLocalStorage()
    }

    public getUniqueID(): string {
        return this._uniqueId
    }

    public getName(): string {
        return this._personalInfo.publicName.replace('_', ' ')
    }

    public getPhoto(): string {
        return ''
    }

    public getMode(): string {
        return 'logged'
    }

    public getData(keys?: string[]): Promise<GameSDK.DataObject> {
        if (!keys) {
            return Promise.resolve(this._playerData)
        } else {
            const correctData = keys.reduce((p, c) => ({ ...p, [c]: this._playerData[c] }), {})
            return Promise.resolve(correctData)
        }
    }

    public setData(data: Record<string, unknown>): Promise<boolean> {
        this._playerData = { ...this._playerData, ...data }
        this.writeDataToLocalStorage(this._playerData)
        return Promise.resolve(true)
    }

    public setStats(stats: object): Promise<boolean> {
        this._playerStats = { ...this._playerStats, ...stats }
        this.writeStatsToLocalStorage(this._playerStats)
        return Promise.resolve(true)
    }

    public incrementStats(increments: object): Promise<GameSDK.StatsObject> {
        for (const [key, value] of Object.entries(increments)) {
            this._playerStats[key] = (this._playerStats[key] || 0) + value
        }
        this.writeStatsToLocalStorage(this._playerStats)
        return Promise.resolve(this._playerStats)
    }

    public getStats(keys?: string[]): Promise<GameSDK.StatsObject> {
        if (!keys) {
            return Promise.resolve(this._playerStats)
        } else {
            const correctData = keys.reduce((p, c) => ({ ...p, [c]: this._playerStats[c] }), {})
            return Promise.resolve(correctData)
        }
    }

    private getDataFromLocalStorage() {
        const data = localStorage.getItem(guestDataStore)
        if (data) {
            return JSON.parse(data)
        }
        return {}
    }

    private writeDataToLocalStorage(data: GameSDK.DataObject) {
        return localStorage.setItem(guestDataStore, JSON.stringify(data))
    }

    private getStatsFromLocalStorage() {
        const data = localStorage.getItem(guestStatsStore)
        if (data) {
            return JSON.parse(data)
        }
        return {}
    }

    private writeStatsToLocalStorage(data: GameSDK.DataObject) {
        return localStorage.setItem(guestStatsStore, JSON.stringify(data))
    }
}

export default MsGamesUser
