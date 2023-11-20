const defaultConfig: DeepPartial<IConfig> = {
    ENV: 'development',

    Ads: {
        Enabled: true,

        Mockup: {
            Enable: false,
            ErrorRate: 5, // %
            GiphyApiKey: 'VmjHIRsfrwCAssDS4mDo9DoImxJm1lLM',
        },

        RewardAdOptions: {
            pID: '123',
        },

        InterstitialAdOptions: {
            pID: '456',
        },
    },

    Analytics: {
        GoogleAnalytics: null,
        FacebookAnalytics: null,
    },

    Statistics: {
        ShowFPSInGame: true,
    },

    Tournament: {
        UseMock: true,
    },
}

export default defaultConfig
