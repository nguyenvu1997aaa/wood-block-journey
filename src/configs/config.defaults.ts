const defaultConfig: IConfig = {
    ENV: 'development',

    AppId: '405221927720733',

    ApiHost: 'https://fbig-singleplay-apps-dev.sunstudio.io',
    OtherHost: 'https://leaderboards-dev.sunstudio.io',

    SyncProfileFromAPI: true,
    PlayerDataStoreUsingApi: false,

    Notification: {
        Enable: false,
        DisableSendNotification: true,
        ApiUrl: 'https://notifications.sunstudio.io',
        GameTitle: 'Sun Studio',
        GameImage: 'https://sunstudio.io/images/logo.png',
    },

    PlayerMock: {
        id: '',
        signature: '',
    },

    OpponentMock: {
        id: '',
        signature: '',
    },

    MatchMockFailRate: 5, // 5%

    Gameplay: {
        StartLevel: 1,
        StartScore: 0,
        StartDiamonds: 0,
        DefaultDiamondsForNewUser: 300,

        LevelDifficultRate: {
            FromUnder30: 1.07,
            FromUnder35: 1.05,
            FromUnder45: 1.05,
            FromUnder200: 1.1,
        },

        StartAdAtLevel: 2,

        GiftTime: 10800, // seconds
        AwardDiamonds: 100,
        FreeItems: false,

        DelayStart: 2000,
        DelayLevelUp: 1800,
        DelayFinishGame: 500,

        EnableVibrate: true,
        VibrateValue: [0, 0, 119, 199, 279, 359, 439],

        Progress: {
            BonusScore: 1000,
            Milestone: 3,
        },

        MaxGemInPiece: 2,
        RatePieceContainGem: 10,
    },

    Tutorial: {
        ForceUseTutorial: false,
        NumberOfTutorial: {
            FirstMove: 3,
            TargetScore: 1,
            CurrentScore: 1,
            ColorfulGem: 1,
            ItemPaint: 1,
            ItemHammer: 1,
            ItemShuffle: 1,
        },
    },

    // Local player data
    PlayerDataStore: 'YANDEX-PlayerData.WoodBlockJourney',

    Game: {
        AutoResize: true,

        PortraitRatio: 450 / 667,
        PortraitWidth: 375,
        PortraitHeight: 667,

        LandscapeRatio: 760 / 450,
        LandscapeWidth: 760,
        LandscapeHeight: 500,

        ForcePixelRatio: 0, // 0 is not use
        AutoDropFps: false,

        DisableLandscape: false,
        // ? Set to true to make canvas size is same as window size
        FullSizeOnLandscape: true,
    },

    Debugger: {
        ShowInspector: true,
        ShowMonitoring: true,
        ShowConsole: false,
        Expanded: true,
        AutoRefresh: true,
        InspectorAutoUpdate: true,
        Opacity: 0.8,
    },

    Statistics: {
        Enable: false,
        DisplayMode: 0,
        FPS: true,
        MS: true,
        MB: true,
        Opacity: 0.8,
        ShowFPSInGame: true,
        ShowMemoryInGame: false,
    },

    ParticleEditor: {
        Enable: false,
        Opacity: 0.8,
        Expanded: true,
    },

    ProfilerPlugin: {
        Enable: false,
    },

    CanvasRecorder: {
        Enable: false,
        Options: {
            Type: 'png',
            Quality: 0.85,
            RecordFps: 60,
            SyncFps: true,
        },
    },

    Match: {
        // Rescue game popup timeout (seconds)
        MaxRescueCount: 1,
        RescueGamePopupTimeout: 10,
        DelayNoThank: 1000,

        ContinueSingleMatchEnabled: false,

        // Local single match
        SingleMatchStore: 'YANDEX-SingleMatch.WoodBlockJourney',
        JourneyMatchStore: 'YANDEX-JourneyMatch.WoodBlockJourney',
        LivesStore: 'lives',

        LocalSingleMatchDefault: {
            _id: '12345678890',
            status: 'open',
            playerId: '',
            score: 0,
            level: 1,
            startedAt: 0,
            updateAt: 0,
            finishAt: 0,
            data: {},
        },

        Levels: [
            200,
            500,
            1000,
            1500,
            2000,
            2500,
            3000,
            3600,
            4200,
            4800,
            5400,
            6000, // +600
            6700,
            7400,
            8100,
            8800,
            9500, // +700
            10300,
            11100,
            11900,
            12700,
            13500, // +800
            14400,
            15300,
            16200,
            17100,
            18000, // +900
        ],

        PieceRandoms: {
            maxPiece: 200,
            measureError: 0.5,
        },
    },

    DailyRewards: {
        MaxDays: 6,
        MockTime: 0, // seconds
        CheckInterrupt: true,
    },

    DailyTasks: {
        Duration: 86400,
    },

    Tournament: {
        UseMock: false,
        ForcePlay: false,
        UseLeaderboard: false,
        TournamentContextIds: [],
    },

    LeadersBoard: {
        Name: null,
        UseMock: false,
        Prefix: 'leaderboards',
        LeaderboardId: '61811128f28777ad0ed05787',
        Limit: 50,
    },

    LanguageSupport: {
        en: 'en',
    },

    EnableEffectSceneTransition: true,

    DefaultTheme: 'default',
    ThemeSupport: {
        default: 'default',
    },

    Ads: {
        Enabled: true,

        CalculateSafeAreaBottom: true,

        // ? When reward ads showed, interstitial ads will be reset time to show
        // * CrazyGame: enable
        // * Yandex: disable
        EnableRewardVideoResetInterstitial: false,

        // Mockup Ads
        Mockup: {
            Enable: false,
            ErrorRate: 5, // %
            GiphyApiKey: '',
        },

        // Options
        InterstitialAdOptions: {
            pID: '',
            showWhenStartGame: false,
            secondsFirstTime: 5,
            secondsBetweenAds: 5,
        },

        RewardAdOptions: {
            pID: '',
            secondsFirstTime: 0,
            secondsBetweenAds: 0,
        },

        BannerAdOptions: [
            {
                placementId: '123',
                position: 'bottom',
                bannerWidth: 320,
                bannerHeight: 50,
                platform: 'MOBILE',
                secondsReload: 60,
            },
            {
                placementId: '456',
                position: 'right',
                bannerWidth: 160,
                bannerHeight: 600,
                platform: 'DESKTOP',
                secondsReload: 60,
            },
        ],
    },

    Network: {
        MaximumRequest: 6,
        Timeout: 15000,
        Retries: 3,
    },

    Analytics: {
        GoogleAnalytics: {
            consoleLog: false,
        },
        FacebookAnalytics: {
            prefix: 'fba',
            consoleLog: false,
        },
    },

    MagnetItem: {
        key: 'magnet-item',
        scoreForOnePercent: 4,
        maxMagnetPerMatch: 5,
    },

    Board: {
        cols: 9,
        rows: 9,
    },

    Sentry: {
        errorCodes: {
            accepted: [],
            ignored: ['USER_INPUT', 'NETWORK_FAILURE'],
        },
        errorMessages: {
            accepted: [],
            ignored: ['Load image failed'],
        },
    },

    DailyChallenge: {
        Prefix: 'leaderboards',
        LeaderBoardId: '61e00146f28777ad0e328f2c',
    },

    Lives: {
        bonusDurationMins: 5,
        bonusLife: 1,
        livesCapacity: 10,
    },

    Rollbar: {
        Enable: false,
        UseMockup: false,

        FilterError: {
            Codes: {
                accepted: [],
                ignored: ['USER_INPUT', 'NETWORK_FAILURE'],
            },
            Messages: {
                accepted: [],
                ignored: ['Load image failed', 'Request failed to be processed'],
            },
        },

        ListPlayerDevIds: [],
    },

    Performance: {
        Enable: false,
        trackingSceneKeys: ['DASHBOARD_SCENE', 'GAME_SCENE'],
        minQuality: 1,
        maxQuality: 2,
        fpsThreshold: 48,
        checkInterval: 2_000,
        qualityAdjustStep: 0.1,
        autoUpgradeQuality: true,
        onlyUpdateWhenSwitchScene: true,
    },
}

export default defaultConfig
