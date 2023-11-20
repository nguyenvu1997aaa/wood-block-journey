import { defaultSettings } from './constants/DefaultSettings'
import * as actions from './redux/actions/player'
import * as selector from './redux/selectors/player'

class PlayerManager extends Phaser.Plugins.BasePlugin implements IPlayerManager {
    private get state(): IState {
        return this.game.storage.getState()
    }

    public async incUserGuideDisplays(): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(actions.incUserGuideDisplays())
    }

    public async receiveData(playerInfo: TPlayer, playerData: IPlayerData | null): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(actions.playerReceived(playerInfo, playerData))
    }

    public async updateData(): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(actions.updatePlayerProfile())
    }

    public async setBestScore(score: number): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(actions.setPlayerBestScore(score))
    }

    public async setSetting(name: string, value: unknown): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(actions.updateSetting(name, value))
    }

    public async setCustomData(name: GameDataKeys, data: unknown): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(actions.setPlayerCustomData(name, data))
    }

    public async setMultiCustomData(customFields: TObject): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(actions.setMultiCustomData(customFields))
    }

    public async requestConnectedPlayers(): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(actions.requestConnectedPlayers())
    }

    public async updateConnectedPlayers(players: TPlayer[]): Promise<void> {
        const { storage } = this.game
        await storage.dispatch(actions.updateConnectedPlayers(players))
    }

    // Selectors
    public getPlayer(): IPlayerState {
        return selector.getPlayer(this.state)
    }

    public getPlayerId(): string {
        return this.getPlayer().playerId
    }

    public getPlayerASID(): string {
        return selector.getPlayerASID(this.state)
    }

    public getPlayerData(): IPlayerData {
        return this.getPlayer().data
    }

    public getPlayerSetting(name: string): unknown {
        const settings = this.getPlayerSettings()

        if (typeof name !== 'string') return null

        if (GameCore.Utils.Object.hasOwn(settings, name)) {
            return settings[name]
        }

        if (GameCore.Utils.Object.hasOwn(defaultSettings, name)) {
            return defaultSettings[name]
        }

        return null
    }

    public getPlayerSettings(): IPlayerSetting {
        return this.getPlayerData().settings
    }

    public getPlayerIsNew(): boolean {
        return this.getPlayer().isUserNew
    }

    /* public getCoins(): number {
        const coin = this.getCustomData('coin')
        if (!GameCore.Utils.Valid.isNumber(coin)) return 0
        return coin
    } */

    public getDiamond(): number {
        const diamond = this.getCustomData('diamond')
        if (!GameCore.Utils.Valid.isNumber(diamond)) return 0

        return diamond
    }

    public getBestScore(): number {
        return selector.getPlayerBestScore(this.state)
    }

    public getCustomData(name: GameDataKeys): unknown {
        const customData = selector.getPlayerCustomData(this.state)

        if (!GameCore.Utils.Valid.isObject(customData)) return null
        if (!GameCore.Utils.Object.hasOwn(customData, name)) return null

        return customData[name]
    }

    public getConnectedPlayers(): IPlayers {
        return selector.getConnectedPlayers(this.state)
    }

    public getConnectedPlayerIds(limit: number, offset: number): string[] {
        return selector.getConnectedPlayerIds(this.state, { limit, offset })
    }
}

export default PlayerManager
