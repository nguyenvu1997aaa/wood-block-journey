import { AnalyticsEvents } from '@/constants/Analytics'

const excludeEvents = [AnalyticsEvents.BUTTON_CLICK, AnalyticsEvents.SCREEN_OPEN]
class FacebookAnalytics extends GameCore.Analytics.BaseAnalytics {
    private game: Phaser.Game

    constructor(game: Phaser.Game, prefix: string, consoleLog?: boolean) {
        super('FacebookAnalytics', { prefix }, '#0F52BA')
        this.game = game

        this.selfLog = consoleLog ? true : false
    }

    protected processEvent(name: string, payload?: Record<string, unknown>, value?: number): void {
        if (excludeEvents.indexOf(name) >= 0) {
            return
        }

        const event = this.getEventName(name)

        const correctPayload: Record<string, string> = {}

        Object.keys(payload || {}).map((key) => {
            if (!payload) return
            if (typeof payload[key] !== 'string') return

            correctPayload[key] = payload[key] as string
        })

        FBInstant.logEvent(event, value, correctPayload)
    }

    protected processPageView(_page: string): void {
        // ? Use page view to log event
    }

    protected processLevelStart(level: number, score?: number, levelName?: string): void {
        this.processEvent(AnalyticsEvents.LEVEL_START, {
            level,
            score: score,
            level_name: levelName,
        })
    }

    protected processLevelRescue(level: number, score?: number, levelName?: string): void {
        this.processEvent(AnalyticsEvents.LEVEL_RESCUE, {
            level,
            score: score,
            level_name: levelName,
        })
    }

    protected processLevelFail(level: number, score?: number, levelName?: string): void {
        this.processEvent(AnalyticsEvents.LEVEL_END, {
            level,
            score: score,
            level_name: levelName,
            success: false,
        })
    }

    protected processLevelComplete(level: number, score?: number, levelName?: string): void {
        this.processEvent(AnalyticsEvents.LEVEL_END, {
            level,
            score: score,
            level_name: levelName,
            success: true,
        })
    }

    protected processShowInterstitialAd(placement?: string): void {
        this.processEvent(AnalyticsEvents.AD_SHOW, {
            ad_type: 'interstitial',
            screen_name: `${placement}`,
        })
    }

    protected processShowRewardedVideoAd(placement?: string): void {
        this.processEvent(AnalyticsEvents.AD_SHOW, {
            ad_type: 'rewarded_video',
            screen_name: `${placement}`,
        })
    }

    protected processShowAdFail(type: GameCore.Ads.Types, placement?: string): void {
        const edaType = type === GameCore.Ads.Types.REWARDED ? 'rewarded_video' : 'interstitial'
        this.processEvent(AnalyticsEvents.AD_SHOW_FAILED, {
            ad_type: edaType,
            screen_name: `${placement}`,
        })
    }

    private getEventName(name: string): string {
        const { prefix } = this.options
        return `${prefix}_${name}`
    }
}

export default FacebookAnalytics
