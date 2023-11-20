import MockBannerAd from '@/ads/MockupBannerAd'
import AdsEvent from './constants/AdsEvent'
import AdStatus from './constants/AdsStatus'
import AdType from './constants/AdsTypes'
import AdError from './exceptions/AdError'
import AdInstance from './instances/AdInstance'

GameCore.Ads = {
    Types: AdType,
    Status: AdStatus,
    Events: AdsEvent,
    AdError: AdError,
    // ? How declaration abstract as classes of variable
    // @ts-expect-error researching
    AdInstance: AdInstance,
}

class AdsManager extends Phaser.Plugins.BasePlugin implements IAdsManager {
    public events: Phaser.Events.EventEmitter

    public enabled: boolean
    private config: IAdsManagerConfig

    private lastInterAdShownTime: number
    private lastRewardAdShownTime: number

    private interstitial: GameCore.Ads.AdInstance
    private rewardedVideo: GameCore.Ads.AdInstance
    private preRoll: GameCore.Ads.AdInstance

    private safeAreaBottom: number
    private showingBannerAd: { [key: string]: boolean }
    private reloadBannerAdIntervals: { [key: string]: NodeJS.Timer | null }
    private bannerAdConfig: BannerAdConfig
    private isHaveBannerAdOptions: boolean

    public init(): void {
        this.events = new Phaser.Events.EventEmitter()

        this.safeAreaBottom = 0
        this.lastInterAdShownTime = 0
        this.lastRewardAdShownTime = 0

        this.showingBannerAd = {}
        this.reloadBannerAdIntervals = {}

        this.isHaveBannerAdOptions = true
    }

    private calculateSafeAreaBottom() {
        try {
            if (!this.config.calculateSafeAreaBottom) return

            this.safeAreaBottom = parseInt(
                getComputedStyle(document.documentElement).getPropertyValue('--sab')
            )

            if (isNaN(this.safeAreaBottom)) {
                this.safeAreaBottom = 0
            }
        } catch {
            this.safeAreaBottom = 0
        }
    }

    public configure(adInstance: typeof GameCore.Ads.AdInstance, config: IAdsManagerConfig): void {
        this.enabled = config.enabled
        this.config = config

        const { bannerAdOptions } = this.config
        if (bannerAdOptions.length === 0) {
            this.isHaveBannerAdOptions = false
        }

        this.setAdInstance(adInstance)

        this.calculateSafeAreaBottom()
    }

    public setAdInstance(adInstance: typeof GameCore.Ads.AdInstance): void {
        const { rewardAdOptions, interstitialAdOptions } = this.config

        this.interstitial = new adInstance(AdType.INTERSTITIAL, interstitialAdOptions.pID)
        this.rewardedVideo = new adInstance(AdType.REWARDED, rewardAdOptions.pID)
        this.preRoll = new adInstance(AdType.PRE_ROLL, interstitialAdOptions.pID)
    }

    public async preloadInterstitialAdAsync(): Promise<void> {
        await this.preloadAdAsync(AdType.INTERSTITIAL)
    }

    public async showInterstitialAdAsync(): Promise<void> {
        if (!this.canbeShowInterstitialAd()) {
            throw new AdError('INTERSTITIAL_AD_CAN_NOT_SHOW', "Can't show interstitial ad")
        }

        await this.showAdAsync(AdType.INTERSTITIAL)

        this.lastInterAdShownTime = window.performance.now() / 1000
    }

    public async preloadPreRollAdAsync(): Promise<void> {
        await this.preloadAdAsync(AdType.PRE_ROLL)
    }

    public async showPreRollAdAsync(): Promise<void> {
        await this.showAdAsync(AdType.PRE_ROLL)
    }

    public async preloadRewardedVideoAsync(): Promise<void> {
        await this.preloadAdAsync(AdType.REWARDED)
    }

    public async showRewardedVideoAsync(): Promise<void> {
        if (!this.canbeShowRewardAd()) {
            throw new AdError('REWARDED_VIDEO_CAN_NOT_SHOW', "Can't show rewarded video")
        }

        await this.showAdAsync(AdType.REWARDED)

        this.lastRewardAdShownTime = window.performance.now() / 1000
    }

    public getRemainingRewardTime(): number {
        const now = window.performance.now() / 1000

        const { secondsBetweenAds } = this.config.rewardAdOptions

        const period = now - this.lastRewardAdShownTime

        return period < secondsBetweenAds ? secondsBetweenAds - period : 0
    }

    public async preloadAdAsync(type: AdType): Promise<void> {
        if (!this.enabled) {
            throw new AdError('ADS_NOT_ENABLED', "Ads is't enabled")
        }

        const adInstance = this.getAdInstanceByType(type)
        if (adInstance === null) {
            throw new AdError('AD_INSTANCE_NOT_INITIATED', 'The instance ads not yet initiated')
        }

        await adInstance.loadAsync()

        this.events.emit(AdsEvent.LOADED, type)
    }

    public async showAdAsync(type: AdType): Promise<void> {
        if (!this.enabled) {
            throw new AdError('ADS_NOT_ENABLED', "Ads is't enabled")
        }

        const adInstance = this.getAdInstanceByType(type)
        if (adInstance === null) {
            throw new AdError('AD_INSTANCE_NOT_INITIATED', 'The instance ads not yet initiated')
        }

        if (type === AdType.INTERSTITIAL || type === AdType.PRE_ROLL) {
            this.lastInterAdShownTime = window.performance.now() / 1000
        }

        if (type === AdType.REWARDED) {
            this.lastRewardAdShownTime = window.performance.now() / 1000

            const { enableRewardVideoResetInterstitial } = this.config
            if (enableRewardVideoResetInterstitial) {
                this.lastInterAdShownTime = this.lastRewardAdShownTime
            }
        }

        try {
            await adInstance.showAsync()
        } catch (error) {
            console.log('adInstance.showAsync', error)
        }

        this.events.emit(AdsEvent.DISPLAYED, type)
    }

    public getAdStatus(type: AdType): string | null {
        const adInstance = this.getAdInstanceByType(type)
        if (!adInstance) return null

        return adInstance.getStatus()
    }

    private getAdInstanceByType(type: AdType): GameCore.Ads.AdInstance | null {
        switch (type) {
            case AdType.INTERSTITIAL:
                return this.interstitial
            case AdType.REWARDED:
                return this.rewardedVideo
            case AdType.PRE_ROLL:
                return this.preRoll
            default:
                return null
        }
    }

    // Some logics

    public canbeShowInterstitialAd(): boolean {
        const success = this.canbeShowInterstitialAdByTime()
        // console.info('canbeShowInterstitialAd', success)
        return success
    }

    private canbeShowInterstitialAdByTime(): boolean {
        const now = window.performance.now() / 1000
        const { secondsFirstTime, secondsBetweenAds } = this.config.interstitialAdOptions

        const period = Math.floor(now - this.lastInterAdShownTime)

        return this.lastInterAdShownTime > 0
            ? period >= secondsBetweenAds
            : period >= secondsFirstTime
    }

    public canbeShowRewardAd(): boolean {
        const now = window.performance.now() / 1000
        const { secondsFirstTime, secondsBetweenAds } = this.config.rewardAdOptions

        const period = Math.floor(now - this.lastRewardAdShownTime)
        return this.lastRewardAdShownTime > 0
            ? period >= secondsBetweenAds
            : period >= secondsFirstTime
    }

    private canShowBannerAd() {
        if (!this.isHaveBannerAdOptions) return false

        const { bannerAdOptions } = this.config
        const isDesktop = GameCore.Utils.Device.isDesktop()

        for (let i = 0; i < bannerAdOptions.length; i++) {
            const banner = bannerAdOptions[i]
            const bannerPlatform = banner.platform
            const canShow =
                bannerPlatform == 'ALL' ||
                (bannerPlatform == 'DESKTOP' && isDesktop) ||
                (bannerPlatform == 'MOBILE' && !isDesktop)

            if (canShow) {
                this.bannerAdConfig = banner
                return true
            }
        }

        return false
    }

    public async showBannerAdAsync(): Promise<void> {
        if (!this.enabled) return

        if (!this.canShowBannerAd()) return

        this.reloadBannerAdIntervals = this.reloadBannerAdIntervals || {}

        const { placementId, secondsReload } = this.bannerAdConfig
        if (!placementId || placementId == '') return

        if (secondsReload > 0) {
            if (this.reloadBannerAdIntervals[placementId]) return

            this.loadBannerAdAsync(placementId, this.bannerAdConfig)

            // auto reload banner ad in N seconds
            this.reloadBannerAdIntervals[placementId] = setInterval(() => {
                this.loadBannerAdAsync(placementId, this.bannerAdConfig)
            }, secondsReload * 1000)
            return
        }

        this.loadBannerAdAsync(placementId, this.bannerAdConfig)

        return
    }

    private async loadBannerAdAsync(placementId: string, config: BannerAdConfig) {
        if (!this.enabled) return

        try {
            const { Ads } = GameCore.Configs

            if (Ads.Mockup.Enable) {
                await MockBannerAd.loadBannerAdAsync()
            } else {
                await GameSDK.loadBannerAdAsync(placementId, config)
            }

            this.showingBannerAd[placementId] = true
        } catch (e) {
            console.log(e)
        }
    }

    public async hideBannerAdAsync(): Promise<void> {
        if (!this.enabled) return
        if (!this.isHaveBannerAdOptions) return

        try {
            const { Ads } = GameCore.Configs

            if (Ads.Mockup.Enable) {
                await MockBannerAd.hideBannerAdAsync()
            } else {
                const { bannerAdOptions } = this.config
                bannerAdOptions.forEach((banner) => {
                    const { placementId } = banner

                    const interval = this.reloadBannerAdIntervals[placementId]
                    if (interval) {
                        clearInterval(interval)
                        this.reloadBannerAdIntervals[placementId] = null
                    }
                    this.showingBannerAd[placementId] = false
                })

                await GameSDK.hideBannerAdAsync()
            }
        } catch (e) {
            console.log(e)
        }
    }

    public getBannerHeight(): number {
        if (!this.enabled) return 0

        if (!this.canShowBannerAd()) return 0

        if (!this.bannerAdConfig.position.includes('bottom')) return 0

        const { bannerHeight = 0 } = this.bannerAdConfig || {}

        //? 20 is margin bottom of ad
        const correctBannerHeight = bannerHeight + this.safeAreaBottom + 20

        // make sure the world plugin has installed
        if (this.game.world) {
            // convert css pixels to game pixels
            const world = this.game.world

            const dpr = world.getPixelRatio()
            const gameZoom = world.getZoomRatio()

            return this.game.world.getPhysicPixels(correctBannerHeight, dpr / gameZoom)
        }

        return correctBannerHeight
    }
}

export default AdsManager
