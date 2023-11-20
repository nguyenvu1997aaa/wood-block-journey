declare interface IState {
    auth: IAuthState
    scene: ISceneState
    player: IPlayerState
    profile: IProfileState
    context: IContextState
    messages: IMessagesState
    missions?: IMissionsState
    dailyTasks?: IDailyTasksState
    dailyRewards?: IDailyRewardsState
}

declare class IStateInitiator {
    constructor(game: Phaser.Game)
    initContext(): void
    initPlayer(): Promise<void>
}

declare interface IContextState {
    contextId: string
    contextType: GameSDK.Type
    entryPointData: TObject | null
    processed: boolean
    currentGameMode: string
}

declare interface ISceneState {
    currentSceneKey: string
    prevSceneKey: string
}

declare interface IMessagesState {
    data: {
        [key: string]: {
            sent: boolean
        }
    }
}
