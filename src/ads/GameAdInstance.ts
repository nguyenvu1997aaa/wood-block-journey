import GlobalScene from '@/game/scenes/global-scene'

class GameAdInstance extends GameCore.Ads.AdInstance {
    protected instance: GameSDK.AdInstance | null
    protected placementId: string

    constructor(type: string, placementId: string) {
        super(type)

        this.instance = null
        this.placementId = placementId
    }

    static setGame(game: Phaser.Game): void {
        // @ts-ignore
        self.game = game
    }

    public async loadAsync(): Promise<void> {
        if (this.status !== GameCore.Ads.Status.IDLE) return

        try {
            this.status = GameCore.Ads.Status.LOADING

            this.instance = await this.createInstanceByType(this.type)

            if (this.instance === null) {
                throw new GameCore.Ads.AdError(
                    'AD_INSTANCE_NOT_INITIATED',
                    `Ad instance didn't initiated.`
                )
            }

            await this.instance.loadAsync()

            this.status = GameCore.Ads.Status.FILLED
        } catch (error) {
            this.status = GameCore.Ads.Status.IDLE
            this.instance = null
            throw error
        }
    }

    public async showAsync(): Promise<void> {
        try {
            if (this.status !== GameCore.Ads.Status.FILLED) {
                throw new GameCore.Ads.AdError('AD_NOT_FILLED', 'Ads no fill.')
            }

            this.status = GameCore.Ads.Status.SHOWING

            if (this.instance === null) {
                throw new GameCore.Ads.AdError(
                    'AD_INSTANCE_NOT_INITIATED',
                    `Ad instance didn't initiated.`
                )
            }

            await this.instance.showAsync()

            const sceneName = this.getSceneName()

            if (this.type === GameCore.Ads.Types.INTERSTITIAL) {
                self.game.analytics.showInterstitialAd(sceneName)
            }

            if (this.type === GameCore.Ads.Types.PRE_ROLL) {
                self.game.analytics.showPreRollAd(sceneName)
            }

            if (this.type === GameCore.Ads.Types.REWARDED) {
                self.game.analytics.showRewardedVideoAd(sceneName)
            }

            this.status = GameCore.Ads.Status.IDLE
            this.instance = null
        } catch (error) {
            if (
                error instanceof Object &&
                GameCore.Utils.Object.hasOwn(error, 'code') &&
                error.code === 'ADS_NOT_LOADED'
            ) {
                this.status = GameCore.Ads.Status.FILLED
            } else {
                this.status = GameCore.Ads.Status.IDLE
                this.instance = null
            }

            const sceneName = this.getSceneName()
            self.game.analytics.showAdFail(this.type, sceneName, error)

            throw error
        } finally {
            //? some platform (game distribution) not focus on game after show ad
            //? cause VisibilityChangeHandler event not fired to resume sound
            window.focus()
        }
    }

    public getStatus(): string {
        return this.status
    }

    protected async createInstanceByType(type: string): Promise<GameSDK.AdInstance | null> {
        const { facebook } = self.game

        switch (type) {
            case GameCore.Ads.Types.REWARDED:
                return await facebook.getRewardedVideoAsync(this.placementId)
            case GameCore.Ads.Types.INTERSTITIAL:
            case GameCore.Ads.Types.PRE_ROLL:
                return await facebook.getInterstitialAdAsync(this.placementId)
            default:
                return null
        }
    }

    private getSceneName(): string {
        try {
            const { globalScene } = self.game

            if (!(globalScene instanceof GlobalScene)) return 'unknown'

            const scene = globalScene.getCurrentScene()

            return scene.scene.getSceneName()
        } catch (error) {
            return 'unknown'
        }
    }
}

export default GameAdInstance
