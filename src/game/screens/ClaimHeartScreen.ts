import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Button from '@/game/components/Button'
import Popup from '@/game/components/Popup'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth, ScreenKeys } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import { reFillLives } from '@/modules/lives/actions/lives'
import {
    getCountDownStartAt,
    getLastBonusLifeTime,
    getLives,
} from '@/modules/lives/selectors/lives'
import { startMultiModeGame } from '@/modules/match/actions/gameplay'
import { convertHMS } from '@/utils/DateTime'
import LivesTimer from '../components/LivesTimer'
import FONTS from '../constants/resources/fonts'
import RefillLivesButton from './component/RefillLivesButton'

const { KEY, FRAME } = SPRITES.DEFAULT
const { Network, Lives } = GameCore.Configs

type TData = {
    currentScreen: GameCore.Screen
    showLivesTimer: boolean
    onClose: Function
}

class ClaimHeartScreen extends GameCore.Screen {
    private popup: Popup
    private title: Phaser.GameObjects.Container
    private buttonClose: Button
    private contents: Phaser.GameObjects.Group
    private backgroundContent: Phaser.GameObjects.Image

    private currentScreen: GameCore.Screen

    private refillLivesButton: RefillLivesButton
    private textTitle: Phaser.GameObjects.Image
    private livesContent: Phaser.GameObjects.Text
    private textContent: Phaser.GameObjects.BitmapText
    private textContent2: Phaser.GameObjects.Text
    private adsTimer: Phaser.Time.TimerEvent

    private livesTimer: LivesTimer
    private intervalTimer: NodeJS.Timer
    private textBlock: Phaser.GameObjects.Image

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private contentShowUpAnimation: BubbleTouchAnimation

    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    constructor(scene: Phaser.Scene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.createPopup()
        this.createLivesTimer()
        this.createTitle()
        this.createContentBackground()
        this.createLiveContent()
        this.createTextContent()
        this.createButtons()

        this.addItem()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)
    }

    public open(data?: TData): void {
        super.open(data)

        this.updateIntervalTimer()

        this.startIntervalTimer()

        this.runOpenAnimation()

        if (data?.currentScreen) this.currentScreen = data.currentScreen

        this.showLivesTimer()
    }

    private showLivesTimer(): void {
        const [showLivesTimer] = this.getData(['showLivesTimer'])

        this.livesTimer.setVisible(showLivesTimer)

        if (showLivesTimer) this.livesTimer.startIntervalTimer()
    }

    private createLivesTimer(): void {
        this.livesTimer = new LivesTimer(this.scene)

        this.popup.add(this.livesTimer)

        Phaser.Display.Align.In.Center(this.livesTimer, this.popup, 0, -270)
    }

    private createContentBackground(): void {
        this.backgroundContent = this.scene.make.image({
            key: KEY,
            frame: FRAME.LIVES_HEART,
        })

        this.backgroundContent.setWorldSize(114, 93)

        this.popup.add(this.backgroundContent)

        Phaser.Display.Align.In.TopCenter(this.backgroundContent, this.popup, 0, -55)
    }

    private createLiveContent(): void {
        const state = this.scene.storage.getState()
        const livesPlayer = getLives(state)

        this.livesContent = this.scene.make.text({
            text: `${livesPlayer}`,
            style: {
                fontFamily: FONTS.FONT_FAMILY_ARIAL,
                fontSize: `${this.scene.fontSize(150)}px`,
                fontStyle: '700',
                align: 'center',
            },
        })

        this.livesContent.setTint(0xffffff)

        this.popup.add(this.livesContent)

        Phaser.Display.Align.In.Center(this.livesContent, this.backgroundContent, 0, 0)
    }

    private createTextContent(): void {
        this.textBlock = this.scene.make.image({
            key: KEY,
            frame: FRAME.LIVES_TIME_BLOCK,
        })

        this.popup.add(this.textBlock)

        this.textBlock.setWorldSize(227, 40)

        Phaser.Display.Align.In.Center(this.textBlock, this.backgroundContent, 0, 80)

        this.textContent = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(40),
            origin: { x: 0.5, y: 0.5 },
        })

        this.popup.add(this.textContent)

        Phaser.Display.Align.In.Center(this.textContent, this.textBlock, 0, 2)

        this.textContent2 = this.scene.make.text({
            text: this.scene.lang.Text.LEVEL,
            style: {
                fontFamily: FONTS.FONT_FAMILY,
                fontSize: `${this.scene.fontSize(40)}px`,
            },
            origin: { x: 0.5, y: 0.5 },
        })

        this.textContent2.setTint(0xeed3b2)

        this.textContent2.setVisible(false)

        this.popup.add(this.textContent2)

        Phaser.Display.Align.In.Center(this.textContent2, this.textBlock, 0, 2)
    }

    public startIntervalTimer(): void {
        this.intervalTimer = setInterval(() => {
            this.updateIntervalTimer()
        }, 1000)
    }

    private updateIntervalTimer(): void {
        const bonusDurationMs = Lives.bonusDurationMins * 60 * 1000
        const state = this.scene.storage.getState()
        const livesPlayer = getLives(state)
        let countDownStartAt = getCountDownStartAt(state)
        const lastBonusLifeTime = getLastBonusLifeTime(state)
        const currentTime = new Date().getTime()

        if (currentTime - lastBonusLifeTime < bonusDurationMs) {
            countDownStartAt = lastBonusLifeTime
        }

        const hms = convertHMS(bonusDurationMs - (currentTime - countDownStartAt))
        const minute = ('0' + hms.minutes).slice(-2)
        const second = ('0' + hms.seconds).slice(-2)

        this.setTextContent(`${this.scene.lang.Text.Next_life}: ${minute}:${second}`)

        const imageScale = this.scene.world.getPixelRatio()

        if (livesPlayer > 0) {
            this.textTitle.setFrame(FRAME.TEXT_KEEP_PLAYING)
            // this.textTitle.setWorldSize(261, 23.5)
        } else {
            this.textTitle.setFrame(FRAME.TEXT_OUT_OF_LIVE)
            // this.textTitle.setWorldSize(234, 19)
        }

        const { width, height } = this.textTitle

        this.textTitle.setWorldSize(width / imageScale, height / imageScale)

        if (parseInt(this.livesContent.text) != livesPlayer) {
            this.livesContent.setText(`${livesPlayer}`)
            Phaser.Display.Align.In.Center(this.livesContent, this.backgroundContent, 0, 0)
        }

        if (livesPlayer === Lives.livesCapacity) {
            this.setTextContent(this.scene.lang.Text.FULL)
            this.refillLivesButton.setVisible(false)
        } else {
            this.refillLivesButton.setVisible(true)
            this.refillLivesButton.runHeartBeatAnimation()
        }
    }

    public stopIntervalTimer(): void {
        clearInterval(this.intervalTimer)
    }

    public setTextContent(text: string): void {
        this.textContent.setText(text)
        Phaser.Display.Align.In.Center(this.textContent, this.textBlock, 0, 2)

        const locale = this.scene.facebook.getLocale()

        if (locale == 'id') {
            this.textContent.setFontSize(this.scene.fontSize(35))
        }

        if (locale == 'ar') {
            this.textContent2.setText(text)
            this.textContent2.setVisible(true)
            this.textContent.setVisible(false)
            Phaser.Display.Align.In.Center(this.textContent2, this.textBlock, 0, 2)
        }
    }

    private createPopup() {
        this.popup = new Popup(this.scene, 0, -30, 290, 323)
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone, 0, -30)
    }

    private createTitle() {
        this.title = this.scene.add.container()

        const imageScale = this.scene.world.getPixelRatio()

        this.textTitle = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_OUT_OF_LIVE,
        })

        const { width, height } = this.textTitle

        this.textTitle.setWorldSize(width / imageScale, height / imageScale)

        this.buttonClose = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)

        this.buttonClose.setName('Close')

        this.buttonClose.onClick = this.handleClose

        this.title.add([this.textTitle, this.buttonClose])

        this.popup.add([this.title])

        Phaser.Display.Align.In.Center(this.textTitle, this.title, 0, 11)

        Phaser.Display.Align.In.Center(this.buttonClose, this.title, 135, -14)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup)
    }

    private handleClose = (): void => {
        this.runCloseAnimation()
    }

    private createButtons(): void {
        this.createRefillLivesButton()
    }

    private createRefillLivesButton(): void {
        this.refillLivesButton = new RefillLivesButton(this.scene)

        this.popup.add(this.refillLivesButton)

        this.refillLivesButton.onClick = this.handleShowRewardedVideoAd

        Phaser.Display.Align.In.Center(this.refillLivesButton, this.popup, 0, 85)
    }

    private clickPlayWithFriend = (): void => {
        this.scene.storage.dispatch(startMultiModeGame())
        if (this.currentScreen) {
            this.currentScreen.setVisible(false)
        }
        this.close()
    }

    private handleShowRewardedVideoAd = async () => {
        const { game, lang } = this.scene
        const { globalScene, audio } = game

        try {
            game.globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
                message: `${lang.Text.LOADING_AD}...`,
                duration: Network.Timeout,
                loading: true,
            })

            audio.pauseMusic()

            await new Promise((resolve, reject) => {
                this.adsTimer?.remove()
                this.adsTimer = this.scene.time.delayedCall(Network.Timeout, reject)

                const adStatus = this.scene.ads.getAdStatus(GameCore.Ads.Types.REWARDED)

                // If this ad are loading, only need listen loaded event
                if (adStatus === GameCore.Ads.Status.LOADING) {
                    this.scene.ads.events.once(GameCore.Ads.Events.LOADED, resolve)
                } else {
                    this.scene.ads.preloadRewardedVideoAsync().then(resolve).catch(reject)
                }
            })

            await this.scene.ads.showRewardedVideoAsync()

            // When success

            this.scene.audio.playSound(SOUND_EFFECT.DAILY_REWARD)

            this.scene.analytics.showRewardedVideoAd(this.getScreenName())

            this.scene.storage.dispatch(reFillLives())

            this.close()
        } catch (error) {
            this.scene.analytics.showAdFail(
                GameCore.Ads.Types.REWARDED,
                this.getScreenName(),
                error
            )
            if (error instanceof Object && GameCore.Utils.Object.hasOwn(error, 'code')) {
                if (error.code === 'USER_INPUT') {
                    this.showNotifySkipAds()
                    return
                }
            }

            this.showNotifyNoAds()
        } finally {
            this.adsTimer?.destroy()
            this.scene.audio.playMusic()
            globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
            this.scene.ads.preloadRewardedVideoAsync().catch((ex) => {
                console.log(ex)
            })

            const [onClose] = this.getData(['onClose'])

            if (onClose) onClose()
        }
    }

    private showNotifyNoAds = (screen?: GameCore.Screen): void => {
        if (screen && screen.name !== ScreenKeys.NOTIFY_SCREEN) return

        const { globalScene, lang } = this.scene.game

        globalScene.screen.events.off(GameCore.Screens.Events.CLOSE)
        globalScene.screen.events.once(GameCore.Screens.Events.CLOSE, this.showGameOver)

        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.NO_ADS_TO_DISPLAY,
            duration: 2000,
            loading: false,
        })
    }

    private showNotifySkipAds = (): void => {
        const { globalScene, lang } = this.scene.game

        globalScene.screen.events.off(GameCore.Screens.Events.CLOSE)
        globalScene.screen.events.once(GameCore.Screens.Events.CLOSE, this.showGameOver)

        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: `${lang.Text.NO_REWARDS}\n${lang.Text.CANCELLED_AD}`,
            duration: 3000,
            loading: false,
        })
    }

    private showGameOver = (screen?: GameCore.Screen): void => {
        if (screen && screen.name !== ScreenKeys.NOTIFY_SCREEN) return

        this.scene.screen.close(this.name)
    }

    private addItem() {
        this.contents = this.scene.add.group()
        this.contents.addMultiple([])
    }

    // Animations
    private runOpenAnimation(): void {
        if (this.popupShowUpAnimation?.tween?.isPlaying()) return

        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.runPopupEntrancesAnimation(0, 300)
        this.runFadeInMaskAnimation(100, 300)
        this.runPopupContentEntrancesAnimation(200, 300)
    }

    private runCloseAnimation(): void {
        if (this.popupFadeOutAnimation?.tween?.isPlaying()) return

        this.stopIntervalTimer()
        // this.scene.audio.playSound(SOUND_EFFECT.POPUP_OFF, { volume: 0.6 })

        this.runPopupExitsAnimation(50, 200)
        this.runFadeOutMaskAnimation(0, 200)
    }

    // Entrances animations
    private runPopupEntrancesAnimation(delay: number, duration: number): void {
        if (!this.popupShowUpAnimation) {
            const { scale } = this.popup
            this.popupShowUpAnimation = new ShowUpAnimation({
                targets: [this.popup],
                delay,
                duration,
                props: {
                    y: 0,
                    alpha: { start: 1, from: 1, to: 1 },
                    scale: { start: 0, from: 0, to: scale },
                },
            })
        }

        this.popupShowUpAnimation.play()
    }

    private runPopupContentEntrancesAnimation(delay: number, duration: number): void {
        this.contentShowUpAnimation?.remove()
        this.contentShowUpAnimation = new BubbleTouchAnimation({
            targets: this.contents.getChildren(),
            duration,
            delay,
            props: {
                alpha: { start: 0, from: 0, to: 1 },
            },
        })

        this.contentShowUpAnimation.play()
    }

    // Exits animations
    private runPopupExitsAnimation(delay: number, duration: number): void {
        if (!this.popupFadeOutAnimation) {
            this.popupFadeOutAnimation = new FadeOutAnimation({
                targets: [this.popup],
                delay,
                duration,
                props: {
                    scale: 0,
                },
                onComplete: () => {
                    this.popup.setY(0)
                    this.scene.screen.close(this.name)
                },
            })
        }

        this.popupFadeOutAnimation.play()
    }

    private runFadeInMaskAnimation(delay: number, duration: number): void {
        if (!this.popupFadeInMaskAnimation) {
            const { alpha } = this.background
            this.popupFadeInMaskAnimation = new FadeInAnimation({
                targets: [this.background],
                delay,
                duration,
                props: {
                    alpha: { start: 0, from: 0, to: alpha },
                },
            })
        }

        this.popupFadeInMaskAnimation.play()
    }

    private runFadeOutMaskAnimation(delay: number, duration: number): void {
        if (!this.popupFadeOutMaskAnimation) {
            const { alpha } = this.background
            this.popupFadeOutMaskAnimation = new FadeOutAnimation({
                targets: [this.background],
                delay,
                duration,
                props: {
                    alpha: { start: alpha, from: alpha, to: 0 },
                },
                onComplete: () => {
                    const [onClose] = this.getData(['onClose'])

                    if (onClose) onClose()
                },
            })
        }

        this.popupFadeOutMaskAnimation.play()
    }
}

export default ClaimHeartScreen
