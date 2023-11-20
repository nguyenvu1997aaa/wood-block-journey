import GameSDK from '../../sdk'
import MsGamesAdInstance from './MsGamesAdInstance'
import MsGamesContext from './MsGamesContext'
import MsGamesGraphApi from './MsGamesGraphApi'
import MsGamesPlayer from './MsGamesPlayer'
import MsGamesTournament from './MsGamesTournaments'

const GameName = import.meta.env.SNOWPACK_PUBLIC_GAME_NAME

class MsGamesAdapter extends GameSDK {
    private sdk: typeof $msstart

    public player: MsGamesPlayer
    public context: MsGamesContext
    public graphApi: MsGamesGraphApi
    public tournament: MsGamesTournament

    private rewardedAdInstance: GameSDK.AdInstance
    private interstitialAdInstance: GameSDK.AdInstance

    private currentPercentLoading = 0

    private shareImageBase64: string | undefined = undefined
    private notificationImageBase64: string | undefined = undefined

    constructor(sdk: typeof $msstart) {
        super()
        this.sdk = sdk
    }

    private initSDKAsync = (): Promise<void> => {
        return new Promise((resolve) => {
            this.player = new MsGamesPlayer(this.sdk)
            this.context = new MsGamesContext(this.sdk)

            this.rewardedAdInstance = new MsGamesAdInstance('rewarded', this.sdk)
            this.interstitialAdInstance = new MsGamesAdInstance('interstitial', this.sdk)

            this.player.initPlayerAsync().finally(resolve)
        })
    }

    private async loadImageAsync(path: string): Promise<string> {
        const base64 = await fetch(path)
            .then((res) => res.blob())
            .then((blob) => {
                const reader = new FileReader()
                return new Promise((resolve, reject) => {
                    try {
                        reader.onload = function () {
                            resolve(this.result)
                        }
                        reader.onerror = reject
                        reader.readAsDataURL(blob)
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        if (base64 && typeof base64 === 'string') {
            return Promise.resolve(base64)
        }
        return Promise.reject()
    }

    public getLocale(): string {
        return this.sdk.getLocale()
    }

    public getSDKVersion(): string {
        return 'v1.0.0-rc.12'
    }

    public getSupportedAPIs(): string[] {
        const supportAPIs = [
            'getLocale',
            'getSDKVersion',
            'initializeAsync',
            'startGameAsync',
            'setLoadingProgress',
            'getInterstitialAdAsync',
            'getRewardedVideoAsync',
            'getPlatform',
            'loadBannerAdAsync',
            'hideBannerAdAsync',
            'getLeaderboardAsync',
            'canCreateShortcutAsync',
            'getPlayerEntryAsync',
        ]

        return supportAPIs
    }

    public initializeAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            const loadingContent = document.getElementById('lds-content')
            if (loadingContent) {
                loadingContent.hidden = false
            } else {
                const loadingElement = `<div id="lds-content"><div id="lds-dual-ring"></div><div id="lds-text"><span id="lds-percent">0</span>% loaded</div></div>`
                if (document.readyState === 'complete') {
                    this.appendHtml(document.body, loadingElement)
                } else {
                    window.addEventListener('load', () => {
                        this.appendHtml(document.body, loadingElement)
                    })
                }
            }
            this.initSDKAsync().then(resolve).catch(reject)
        })
    }

    public startGameAsync(): Promise<void> {
        this.setLoadingProgress(100)
        document.getElementById('lds-content')?.remove()
        return Promise.resolve()
    }

    public setLoadingProgress(percent: number): void {
        const loadingPercent = document.getElementById('lds-percent')
        if (loadingPercent) {
            this.currentPercentLoading = Math.round(
                Math.max(Math.min(percent, 100), this.currentPercentLoading)
            )
            loadingPercent.innerHTML = `${this.currentPercentLoading}`
            this.currentPercentLoading = percent
        }
    }

    public setSessionData(_: unused): void {
        //
    }

    public async shareAsync(_: unused): Promise<void> {
        if (!this.shareImageBase64) {
            this.shareImageBase64 = await this.loadImageAsync('/assets/images/others/share.jpg')
        }

        return new Promise((resolve, reject) => {
            this.sdk
                .shareAsync({
                    title: GameName as string,
                    text: 'Play now!',
                    image: this.shareImageBase64,
                })
                .then(() => resolve())
                .catch(reject)
        })
    }

    public updateAsync(_: unused): Promise<void> {
        return new Promise((_, reject) => {
            reject(new Error('Unsupported'))
        })
    }

    public switchGameAsync(appID: string, data?: unknown): Promise<void> {
        return this.sdk.switchGameAsync({
            id: appID,
            payloadData: data as object,
        })
    }

    public canCreateShortcutAsync(): Promise<boolean> {
        return Promise.resolve(true)
    }

    public createShortcutAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.sdk
                .promptInstallAsync()
                .then(() => resolve())
                .catch(reject)
        })
    }

    public logEvent(): null {
        return null
    }

    public onPause(_: unused): void {
        //
    }

    public getInterstitialAdAsync(_: unused): Promise<GameSDK.AdInstance> {
        return new Promise((resolve) => {
            resolve(this.interstitialAdInstance)
        })
    }

    public getRewardedVideoAsync(_: unused): Promise<GameSDK.AdInstance> {
        return new Promise((resolve) => {
            resolve(this.rewardedAdInstance)
        })
    }

    public matchPlayerAsync(_: unused): Promise<void> {
        return new Promise((_, reject) => {
            reject(new Error('Unsupported'))
        })
    }

    public checkCanPlayerMatchAsync(): Promise<boolean> {
        return new Promise((_, reject) => {
            reject(false)
        })
    }

    public getLeaderboardAsync(_name: string): Promise<GameSDK.Leaderboard> {
        return new Promise((_, reject) => {
            reject(new Error('Unsupported'))
        })
    }

    private appendHtml(el: HTMLElement, str: string) {
        const div = document.createElement('div')
        div.innerHTML = str
        while (div.children.length > 0) {
            el.appendChild(div.children[0])
        }
    }

    public getPlatform(): GameSDK.Platform | null {
        const userAgent = navigator.userAgent || navigator.vendor

        if (/android/i.test(userAgent)) {
            return 'ANDROID'
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        // @ts-expect-error MSStream is not defined in the browser
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'IOS'
        }

        return 'WEB'
    }

    public postSessionScoreAsync(score: number): Promise<void> {
        return Promise.reject(new Error('Unsupported'))
    }

    public loadBannerAdAsync(_placementID: string, config: BannerAdConfig): Promise<void> {
        const { position, bannerWidth, bannerHeight } = config
        const placement = `${position}:${bannerWidth}x${bannerHeight}`
        if (!this.isValidDisplayAdPlacement(placement)) {
            return Promise.reject(new Error('Invalid banner ad placement'))
        } else {
            return new Promise((resolve, reject) => {
                this.sdk
                    .showDisplayAdsAsync(placement)
                    .then(() => resolve())
                    .catch(reject)
            })
        }
    }

    private isValidDisplayAdPlacement(placement: string): placement is $msstart.DisplayAdPlacement {
        const listSupports = [
            'top:728x90',
            'bottom:728x90',
            'left:300x250',
            'right:300x250',
            'topleft:300x250',
            'topright:300x250',
            'bottomleft:300x250',
            'bottomright:300x250',
            'top:320x50',
            'right:320x50',
            'bottom:320x50',
            'left:320x50',
            'left:300x600',
            'right:300x600',
            'top:970x250',
            'bottom:970x250',
            'left:160x600',
            'right:160x600',
        ]

        if (listSupports.includes(placement)) {
            return true
        }

        return false
    }

    public hideBannerAdAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.sdk
                .hideDisplayAdsAsync()
                .then(() => resolve())
                .catch(reject)
        })
    }

    public async showGameRating(): Promise<void> {
        return Promise.reject(new Error('Unsupported'))
    }

    public getTournamentAsync(): Promise<GameSDK.Tournament> {
        return Promise.reject(new Error('Unsupported'))
    }

    public inviteAsync(_payload: GameSDK.InvitePayload): Promise<void> {
        return Promise.reject(new Error('Unsupported'))
    }

    public shareLinkAsync(_payload: GameSDK.LinkSharePayload): Promise<void> {
        return Promise.reject(new Error('Unsupported'))
    }

    public submitGameResultsAsync(score: number): Promise<boolean> {
        return this.sdk.submitGameResultsAsync(score)
    }

    public async scheduleNotificationAsync(
        data?: DeepPartial<$msstart.NotificationData>
    ): Promise<void> {
        if (!this.notificationImageBase64) {
            this.notificationImageBase64 = await this.loadImageAsync(
                '/assets/images/others/notification.jpg'
            )
        }

        let defaultData: $msstart.NotificationData = {
            title: GameName as string,
            description: 'We miss you!',
            type: 0,
            minDelayInSeconds: 3.6,
            imageData: this.notificationImageBase64,
            callToAction: 'Play now!',
        }

        defaultData = { ...defaultData, ...data }

        return new Promise((resolve, reject) => {
            this.sdk
                .scheduleNotificationAsync(defaultData)
                .then(() => resolve())
                .catch(reject)
        })
    }
}

export default MsGamesAdapter
