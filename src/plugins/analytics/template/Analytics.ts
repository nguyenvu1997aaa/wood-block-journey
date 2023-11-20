abstract class BaseAnalytics implements IAnalytic {
    public name: string
    private color: string
    protected selfLog: boolean
    protected options: TObject

    constructor(name: string, options: TObject, color?: string) {
        this.name = name
        this.color = color || '#FFF'
        this.options = options
        this.selfLog = true

        console.info(`%c${this.name}: init`, `color: ${this.color}`, this.options)
    }

    public event(name: string, payload?: Record<string, unknown>, value?: unknown): void {
        this.processEvent(name, payload, value)

        if (this.selfLog) {
            console.info(`%c${this.name}: event`, `color: ${this.color}`, { name, value, payload })
        }
    }

    public pageview(key: string): void {
        const page = this.getPageByKey(key)
        this.processPageView(page)

        if (this.selfLog) {
            console.info(`%c${this.name}: pageview`, `color: ${this.color}`, { page })
        }
    }

    public levelStart(level: number, score?: number, levelName?: string): void {
        this.processLevelStart(level, score, levelName)

        if (this.selfLog) {
            console.info(`%c${this.name}: level start`, `color: ${this.color}`, {
                level,
                score,
                levelName,
            })
        }
    }

    public levelFail(level: number, score?: number, levelName?: string): void {
        this.processLevelFail(level, score, levelName)

        if (this.selfLog) {
            console.info(`%c${this.name}: level fail`, `color: ${this.color}`, {
                level,
                score,
                levelName,
            })
        }
    }

    public levelRescue(level: number, score?: number, levelName?: string): void {
        this.processLevelRescue(level, score, levelName)

        if (this.selfLog) {
            console.info(`%c${this.name}: level rescue`, `color: ${this.color}`, {
                level,
                score,
                levelName,
            })
        }
    }

    public levelComplete(level: number, score?: number, levelName?: string): void {
        this.processLevelComplete(level, score, levelName)

        if (this.selfLog) {
            console.info(`%c${this.name}: level complete`, `color: ${this.color}`, {
                level,
                score,
                levelName,
            })
        }
    }

    public showPreRollAd(placement?: string | undefined): void {
        this.processShowPreRollAd(placement)

        if (this.selfLog) {
            console.info(`%c${this.name}: show pre-roll`, `color: ${this.color}`, {
                placement,
            })
        }
    }

    public showInterstitialAd(placement?: string): void {
        this.processShowInterstitialAd(placement)

        if (this.selfLog) {
            console.info(`%c${this.name}: show interstitial ad`, `color: ${this.color}`, {
                placement,
            })
        }
    }

    public showRewardedVideoAd(placement?: string): void {
        this.processShowRewardedVideoAd(placement)

        if (this.selfLog) {
            console.info(`%c${this.name}: show rewarded video ad`, `color: ${this.color}`, {
                placement,
            })
        }
    }

    public receiveReward(placement?: string): void {
        this.processReceiveReward(placement)

        if (this.selfLog) {
            console.info(`%c${this.name}: receive reward`, `color: ${this.color}`, { placement })
        }
    }

    public showAdFail(type: GameCore.Ads.Types, placement?: string, reason?: number): void {
        this.processShowAdFail(type, placement, reason)

        if (this.selfLog) {
            console.info(`%c${this.name}: show ad fail`, `color: ${this.color}`, {
                type,
                placement,
                reason,
            })
        }
    }

    protected getPageByKey(key: string): string {
        let path = key.replace(/_/g, '-')
        path = path.toLowerCase()

        return path
    }

    protected abstract processEvent(
        name: string,
        payload?: Record<string, unknown>,
        value?: unknown
    ): void

    protected processLevelStart(_level: number, _score?: number, _levelName?: string): void {
        //? implement in subclass
    }

    protected processLevelFail(_level: number, _score?: number, _levelName?: string): void {
        //? implement in subclass
    }

    protected processLevelRescue(_level: number, _score?: number, _levelName?: string): void {
        //? implement in subclass
    }

    protected processLevelComplete(_level: number, _score?: number, _levelName?: string): void {
        //? implement in subclass
    }

    protected processShowInterstitialAd(_placement?: string): void {
        //? implement in subclass
    }

    protected processShowPreRollAd(_placement?: string): void {
        //? implement in subclass
    }

    protected processShowRewardedVideoAd(_placement?: string): void {
        //? implement in subclass
    }

    protected processReceiveReward(_placement?: string): void {
        // ? implement in subclass
    }

    protected processShowAdFail(
        _type: GameCore.Ads.Types,
        _placement?: string,
        _reason?: number
    ): void {
        // ? implement in subclass
    }

    protected abstract processPageView(page: string): void
}

export default BaseAnalytics
