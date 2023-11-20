import generateName from '@/utils/string/generateName'

const GameName = import.meta.env.SNOWPACK_PUBLIC_GAME_NAME

const guestIDStore = GameName + '_GuestID'
const guestDataStore = GameName + '_GuestData'
const guestStatsStore = GameName + 'GuestStats'

class Guest implements $msstart.Player {
    public _personalInfo: $msstart.PersonalInfo

    private _uniqueId: string

    private _playerData: GameSDK.DataObject
    private _playerStats: GameSDK.StatsObject

    constructor() {
        this._uniqueId = this.checkAndGetIdFromLocalStorage()
        this._personalInfo = {
            id: this._uniqueId,
            avatarIdHash: '0',
            lang: 'en',
            publicName: this.getName(),
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
        return this.getUniqueID().replace('_', ' ')
    }

    public getPhoto(): string {
        return ''
    }

    public getMode(): string {
        return ''
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

    private checkAndGetIdFromLocalStorage() {
        const localId = localStorage.getItem(guestIDStore)

        if (localId != null && localId.toLowerCase().indexOf('guest') === -1) {
            return localId
        } else {
            const randomId = this.getRandomID()
            localStorage.setItem(guestIDStore, randomId)
            return randomId
        }
    }

    private getRandomID() {
        return generateName().replace(' ', '_')
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

export default Guest
