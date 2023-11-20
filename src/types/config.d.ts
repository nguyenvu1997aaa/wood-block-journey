interface IConfig {
    ENV: string
    AppId: string
    ApiHost: string
    /**
     * From this version of GameCore, no longer use localStorage, host api to save data
     *
     * so we have this options to integrate.
     *
     * If `true`, the game will sync old data from the host api to fb api
     *
     * After syncing, no longer use localStorage, host api to save data
     *
     * On other platform (not facebook), this value should be `true` to
     * change `customFields` keys to `gameData` keys on saved data
     */
    SyncProfileFromAPI: boolean
    Notification: NotificationConfig
    OtherHost: string
    PlayerDataStoreUsingApi: boolean
    PlayerMock: PlayerMockConfig
    OpponentMock: PlayerMockConfig
    MatchMockFailRate: number
    Gameplay: Gameplay
    Debugger: DebuggerConfig
    Statistics: StatisticsConfig
    ParticleEditor: ParticleEditorConfig
    ProfilerPlugin: ProfilerPluginConfig
    CanvasRecorder: CanvasRecorderConfig
    Tutorial: Tutorial
    PlayerDataStore: string
    Game: Game
    Match: Match
    DailyRewards: DailyRewards
    DailyTasks: DailyTasks
    Tournament: Tournament
    LeadersBoard: LeadersBoard
    LanguageSupport: LanguageSupport
    EnableEffectSceneTransition: boolean
    DefaultTheme: string
    ThemeSupport: ThemeSupport
    Ads: Ads
    Network: Network
    Analytics: Analytics
    MagnetItem: MagnetItem
    Board: Board
    Sentry: SentryConfig
    Lives: ILives
    DailyChallenge: DailyChallenge
    Performance: {
        Enable: boolean
        minQuality: number
        maxQuality: number
        qualityAdjustStep: number
        trackingSceneKeys: string[]
    } & PerformanceOptions
    Rollbar: RollbarConfig
}

interface PerformanceOptions {
    fpsThreshold: number
    checkInterval: number
    autoUpgradeQuality: boolean
    onlyUpdateWhenSwitchScene: boolean
}

interface StatisticsConfig {
    Enable: boolean
    DisplayMode: number
    FPS: boolean
    MS: boolean
    MB: boolean
    Opacity: number
    ShowFPSInGame: boolean
    ShowMemoryInGame: boolean
}

interface DebuggerConfig {
    ShowMonitoring: boolean
    ShowInspector: boolean
    ShowConsole: boolean
    Expanded: boolean
    AutoRefresh: boolean
    Opacity: number
    InspectorAutoUpdate: boolean
}

interface ParticleEditorConfig {
    Enable: boolean
    Opacity: number
    Expanded: boolean
}

interface ProfilerPluginConfig {
    Enable: boolean
}

interface CanvasRecorderConfig {
    Enable: boolean
    Options: {
        Type: 'webp' | 'png' | 'jpeg'
        Quality: number
        RecordFps: number
        SyncFps: boolean
    }
}

interface Analytics {
    GoogleAnalytics: GoogleAnalytics | null
    FacebookAnalytics: FacebookAnalytics | null
}

interface FacebookAnalytics {
    prefix: string
    consoleLog: boolean
}

interface GoogleAnalytics {
    consoleLog: boolean
}

interface Network {
    MaximumRequest: number
    Timeout: number
    Retries: number
}

interface Ads {
    Enabled: boolean
    CalculateSafeAreaBottom: boolean
    EnableRewardVideoResetInterstitial: boolean

    Mockup: {
        Enable: boolean
        ErrorRate: number
        GiphyApiKey: string
    }

    InterstitialAdOptions: {
        pID: string
        showWhenStartGame: boolean
        secondsFirstTime: number
        secondsBetweenAds: number
    }

    RewardAdOptions: {
        pID: string
        secondsFirstTime: number
        secondsBetweenAds: number
    }

    BannerAdOptions: BannerAdConfig[]
}

type BannerAdConfig = {
    placementId: string
    position:
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'topleft'
        | 'topright'
        | 'bottomleft'
        | 'bottomright'
    bannerWidth: number
    bannerHeight: number
    secondsReload: number
    platform: 'DESKTOP' | 'MOBILE' | 'ALL'
}

interface ThemeSupport {
    default: string
}

interface LanguageSupport {
    en: string
}

interface Ga {
    trackingId: string
}

interface LeadersBoard {
    Name: string | null
    UseMock: boolean
    Limit: number
    Prefix: string
    LeaderboardId: string | null
}

interface GlobalTournament {
    id: number
    title: string
    endTime: number
    contextID: string
}

interface Tournament {
    UseMock: boolean
    ForcePlay: boolean
    UseLeaderboard: boolean
    TournamentContextIds: string[]
}

interface DailyTasks {
    Duration: number
}

interface DailyRewards {
    MaxDays: number
    MockTime: number
    CheckInterrupt: boolean
}

interface DailyChallenge {
    Prefix: string
    LeaderBoardId: string
}

interface Match {
    MaxRescueCount: number
    RescueGamePopupTimeout: number
    DelayNoThank: number
    ContinueSingleMatchEnabled: boolean
    SingleMatchStore: string
    JourneyMatchStore: string
    LivesStore: string
    LocalSingleMatchDefault: LocalSingleMatchDefault
    Levels: number[]
    PieceRandoms: PieceRandoms
}

interface PieceRandoms {
    maxPiece: number
    measureError: number
}

interface LocalSingleMatchDefault {
    _id: string
    status: string
    playerId: string
    score: number
    level: number
    startedAt: number
    updateAt: number
    finishAt: number
    data: TObject
}

interface Game {
    AutoResize: boolean
    PortraitRatio: number
    PortraitWidth: number
    PortraitHeight: number
    LandscapeRatio: number
    LandscapeWidth: number
    LandscapeHeight: number
    ForcePixelRatio: number
    AutoDropFps: boolean
    DisableLandscape: boolean
    FullSizeOnLandscape: boolean
}

interface Tutorial {
    ForceUseTutorial: boolean
    NumberOfTutorial: NumberOfTutorial
}

interface NumberOfTutorial {
    FirstMove: number
    TargetScore: number
    CurrentScore: number
    ColorfulGem: number
    ItemPaint: number
    ItemHammer: number
    ItemShuffle: number
}

interface Gameplay {
    StartLevel: number
    StartScore: number
    StartDiamonds: number
    DefaultDiamondsForNewUser: number
    LevelDifficultRate: LevelDifficultRate
    StartAdAtLevel: number
    GiftTime: number
    AwardDiamonds: number
    FreeItems: boolean
    DelayStart: number
    DelayLevelUp: number
    DelayFinishGame: number
    EnableVibrate: boolean
    VibrateValue: number[]
    Progress: {
        BonusScore: number
        Milestone: number | string
    }
    MaxGemInPiece: number
    RatePieceContainGem: number
}

interface LevelDifficultRate {
    FromUnder30: number
    FromUnder35: number
    FromUnder45: number
    FromUnder200: number
}

interface MagnetItem {
    key: string
    scoreForOnePercent: number
    maxMagnetPerMatch: number
}

interface Board {
    cols: number
    rows: number
}

interface NotificationConfig {
    Enable: boolean
    DisableSendNotification: boolean
    ApiUrl: string
    GameTitle: string
    GameImage: string
}

interface PlayerMockConfig {
    id: string
    signature: string
    name?: string
    photo?: string
}

interface SentryConfig {
    errorCodes: FilteringError
    errorMessages: FilteringError
}

interface FilteringError {
    accepted: string[]
    ignored: string[]
}

interface ILives {
    livesCapacity: number
    bonusDurationMins: number
    bonusLife: number
}

interface RollbarConfig {
    Enable: boolean
    UseMockup: boolean

    FilterError: {
        Codes: FilteringError
        Messages: FilteringError
    }
    ListPlayerDevIds: string[]
}
