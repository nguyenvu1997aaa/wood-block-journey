declare interface IImageElement extends HTMLImageElement {
    isSuccess: boolean
    isLoading: boolean
    originalSrc: string
}

declare interface IDailyRewarded {
    lastRewarded: number
    logDays: boolean[]
}

interface ILogTask {
    [key: string]: {
        rewarded: boolean
    } & {
        [key: string]: number
    }
}

declare interface IDailyTasks {
    startedTime: number
    logTasks: ILogTask
}

// Init State
declare interface IRewardPayload {
    id: number
    type: string
    value: number
    status?: string
}

declare interface IDailyRewardsState {
    rewards: IRewardPayload[]
    isRequesting: boolean
}

declare interface ITaskEventPayload {
    type: string
    value: number
}

declare interface IMission {
    id: string
    name: string
    require: {
        [key: string]: number
    }
    reward: number
    status?: string
}

declare interface IMissionEventPayload {
    id: string
    type: string
    value: number
}

declare type TProcess = {
    [key: string]: number
}

declare type TRequire = {
    [key: string]: number
}

declare interface IMissionProcess {
    name: string
    process: TProcess
    require: TRequire
    reward: number
}

declare interface IMissionsData {
    [key: string]: IMission
}

declare interface IMissionsState {
    mission: IMissionProcess | null
    missions: IMissionsData | null
    isRequesting: boolean
}

declare interface SwitchButtonOptions {
    enable: boolean
    width: number
    height: number
}

declare interface ToggleButtonOptions {
    enable: boolean
    frameOn: string
    frameOff: string
    backgroundOn: string
    backgroundOff: string
}

// Gameplay
interface ITileData {
    moveX?: number
    moveY?: number
    lastX?: number
    lastY?: number
}

declare interface IBaseManager {
    start(): void
    stop(): void

    isReady(): boolean
    isRunning(): boolean
    isStopped(): boolean
}

// Level
declare interface ISpecialsConfig {
    [key: string]: number | undefined
}

declare interface ISetsConfig {
    [key: string]: number | undefined
}
declare interface ILevelConfig {
    mode: string
    colors: string[]
    specials: ISpecialsConfig
    sets: ISetsConfig
    rows: number
    columns: number
    eatableSize: number
    scorePerItem: number
    targetScore: number
}

declare interface IGameLevel {
    [key: number]: ILevelConfig
}

declare class LevelHandler {
    public init(): void
    public up(): void
    public getConfigs(): ILevelConfig
    private canLevelUp(): boolean
}

declare interface IUrls {
    [key: string]: string
}

declare interface ITweenBuilderConfig extends Phaser.Types.Tweens.TweenBuilderConfig {
    props?: {
        [key: string]:
            | number
            | string
            | TObject
            | Phaser.Types.Tweens.GetEndCallback
            | Phaser.Types.Tweens.TweenPropConfig
    }
}

declare interface IBestScoreBlockPayload {
    bestScore: number
    currentScore: number
}
