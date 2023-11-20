interface IPlayerManager {
    incUserGuideDisplays(): Promise<void>
    receiveData(playerInfo: TPlayer, playerData: IPlayerData | null): Promise<void>
    updateData(): Promise<void>
    setBestScore(score: number): Promise<void>
    setSetting(name: string, value: unknown): Promise<void>
    setCustomData(name: GameDataKeys, data: unknown): Promise<void>
    setMultiCustomData(customFields: TObject): Promise<void>
    requestConnectedPlayers(): Promise<void>
    updateConnectedPlayers(players: TPlayer[]): Promise<void>
    getPlayer(): IPlayerState
    getPlayerId(): string
    getPlayerASID(): string
    getPlayerData(): IPlayerData
    getPlayerSetting(name: string): unknown
    getPlayerSettings(): IPlayerSetting
    getPlayerIsNew(): boolean
    // getCoins(): number
    getDiamond(): number
    getBestScore(): number
    getCustomData(name: GameDataKeys): unknown
    getConnectedPlayers(): IPlayers
    getConnectedPlayerIds(limit: number, offset: number): string[]
}
