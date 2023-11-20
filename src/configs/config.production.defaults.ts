const defaultConfig: DeepPartial<IConfig> = {
    ENV: 'production',

    Notification: {
        // Disable on Yandex
        Enable: false,
    },

    LeadersBoard: {
        Prefix: 'leaderboards',
    },

    Debugger: {
        ShowConsole: false,
        ShowInspector: false,
        ShowMonitoring: false,
    },

    Statistics: {
        Enable: false,
        ShowFPSInGame: false,
        ShowMemoryInGame: false,
    },

    ParticleEditor: {
        Enable: false,
    },
}

export default defaultConfig
