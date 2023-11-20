declare namespace GameCore {
    namespace Analytics {
        class BaseAnalytics implements IAnalytic {
            public name: string
            private color: string
            protected selfLog: boolean
            protected options: TObject

            constructor(name: string, options: TObject, color?: string)
            public event(name: string, payload?: Record<string, any>, value?: any): void
            public pageview(key: string): void

            public levelStart(level: number, score?: number, levelName?: string): void
            public levelFail(level: number, score?: number, levelName?: string): void
            public levelRescue(level: number, score?: number, levelName?: string): void
            public levelComplete(level: number, score?: number, levelName?: string): void
            public showPreRollAd(placement?: string): void
            public showInterstitialAd(placement?: string): void
            public showRewardedVideoAd(placement?: string): void
            public receiveReward(placement?: string): void
            public showAdFail(
                type: GameCore.Ads.Types,
                placement?: string,
                reason?: AdErrorCode
            ): void

            protected abstract processEvent(
                name: string,
                payload?: Record<string, any>,
                value?: any
            ): void
            protected abstract processPageView(page: string): void

            protected processLevelStart(level: number, score?: number, levelName?: string): void
            protected processLevelFail(level: number, score?: number, levelName?: string): void
            protected processLevelRescue(level: number, score?: number, levelName?: string): void
            protected processLevelComplete(level: number, score?: number, levelName?: string): void
            protected processShowPreRollAd(placement?: string): void
            protected processShowInterstitialAd(placement?: string): void
            protected processShowRewardedVideoAd(placement?: string): void
            protected processReceiveReward(placement?: string): void
            protected processShowAdFail(
                type: GameCore.Ads.Types,
                placement?: string,
                reason?: AdErrorCode
            ): void

            protected getPageByKey(key: string): string
        }
    }
}
