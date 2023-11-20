import { AnalyticsEvents } from '@/constants/Analytics'
import { getCurrentGameMode } from '@/redux/selectors/context'

// ? Google Analytics
// send, hitType, ...fields
// event: send, event, eventCategory, eventAction, eventLabel, eventValue, {...fieldsObject}
// pageview: send, pageview, page, {title, location, page}

interface IGoogleAnalyticsConfig {
    userId: string
    trackingId: string
    measuringId: string
    version: string
}

const excludeEvents = [AnalyticsEvents.SCREEN_OPEN]

class GoogleAnalytics extends GameCore.Analytics.BaseAnalytics {
    private game: Phaser.Game

    private trackingId: string

    private currentPath = '/'

    constructor(game: Phaser.Game, config: IGoogleAnalyticsConfig) {
        super('GoogleAnalytics', { ...config }, '#E35335')
        const { trackingId } = config

        this.game = game

        const { consoleLog } = GameCore.Configs.Analytics.GoogleAnalytics || {}
        this.selfLog = consoleLog ? true : false

        this.trackingId = trackingId
    }

    protected processEvent(name: string, payload?: Record<string, unknown>, value?: unknown): void {
        if (excludeEvents.indexOf(name) >= 0) return
        const eventName = this.formatEventName(name)
        let options = payload ? { ...payload } : {}
        options = value ? { ...options, value } : options
        options = {
            ...options,
            page_path: this.currentPath,
            send_to: 'GA',
        }
        gtag('event', eventName, options)
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

    protected processShowPreRollAd(placement?: string): void {
        this.processEvent(AnalyticsEvents.AD_SHOW, {
            ad_type: 'pre_roll',
            screen_name: `${placement}`,
        })
        this.processEvent(AnalyticsEvents.AD_IMPRESSION, {
            ad_format: 'pre_roll',
        })
    }

    protected processShowInterstitialAd(placement?: string): void {
        this.processEvent(AnalyticsEvents.AD_SHOW, {
            ad_type: 'interstitial',
            screen_name: `${placement}`,
        })
        this.processEvent(AnalyticsEvents.AD_IMPRESSION, {
            ad_format: 'Interstitial',
        })
    }

    protected processShowRewardedVideoAd(placement?: string): void {
        this.processEvent(AnalyticsEvents.AD_SHOW, {
            ad_type: 'rewarded_video',
            screen_name: `${placement}`,
        })
        this.processEvent(AnalyticsEvents.AD_IMPRESSION, {
            ad_format: 'Rewarded',
        })
    }

    protected processShowAdFail(type: GameCore.Ads.Types, placement?: string): void {
        const edaType = type === GameCore.Ads.Types.REWARDED ? 'rewarded_video' : 'interstitial'
        this.processEvent(AnalyticsEvents.AD_SHOW_FAILED, {
            ad_type: edaType,
            screen_name: `${placement}`,
        })
    }

    protected processPageView(page: string): void {
        const mode = this.getGameplayMode()
        const path = `/${mode}/${page}`
        this.currentPath = path
        document.title = this.formatPageTitle(mode, page)
        gtag('event', 'page_view', {
            page_path: this.currentPath,
            send_to: ['GA', this.trackingId],
        })
    }

    private getGameplayMode(): string {
        const { storage } = this.game
        const state = storage.getState()

        return getCurrentGameMode(state)
    }

    private formatEventName(rawName: string) {
        return rawName.toLowerCase().replace(/:/g, '_')
    }

    private formatPageTitle(mode: string, page: string) {
        return `${this.toUpperCamelCaseWithSpace(mode)}::${this.toUpperCamelCaseWithSpace(page)}`
    }

    private toUpperCamelCaseWithSpace(s: string) {
        const text = s.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? ' ' + c.toUpperCase() : ''))
        return text.substr(0, 1).toUpperCase() + text.substr(1)
    }
}

export default GoogleAnalytics
