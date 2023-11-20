import PulsateBubbleAnimation from '@/game/animations/attention/PulsateBubble'
import EaseBubbleOut from '@/game/animations/easing/BubbleOut'
import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Popup from '@/game/components/Popup'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth, ScreenKeys } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import GAME_EVENT from '@/game/gameplay/events/game'
import { useRescue } from '@/modules/match/actions/gameplay'
import { getGameplayCurrentStats } from '@/modules/match/selectors/stats'
import Emitter from '@/utils/emitter'
import GameScene from '..'
import ContinueButton from './rescue-screen/ContinueButton'
import SkipButton from './rescue-screen/SkipButton'

const { KEY, FRAME } = SPRITES.DEFAULT
const { Network, Match } = GameCore.Configs

class RescueScreen extends GameCore.Screen {
    public scene: GameScene
    private isUseRescue: boolean

    private countdownCount: number

    private popup: Popup
    private skipText: SkipButton

    private continueButton: ContinueButton
    private tweenContinueButton: Phaser.Tweens.Tween
    private continueButtonAnimation: PulsateBubbleAnimation

    private textRescueTime: Phaser.GameObjects.BitmapText
    private tweenTextRescueTime: Phaser.Tweens.Tween

    private progressCircle: Phaser.GameObjects.Graphics
    private skipTextTween: Phaser.Tweens.Tween

    private countdownTimer: Phaser.Time.TimerEvent

    private bgProgress: Phaser.GameObjects.Image

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation
    private adsTimer: Phaser.Time.TimerEvent

    constructor(scene: GameScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.countdownCount = Match.MaxRescueCount

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)

        this.createPopup()

        this.createContent()
    }

    public open = (): void => {
        super.open()

        this.scene.audio.playSound(SOUND_EFFECT.RESCUE_TIME)

        this.runOpenAnimation()
    }

    public close = (): void => {
        super.close()

        this.scene.audio.stopSound(SOUND_EFFECT.RESCUE_TIME)

        this.bgProgress.setVisible(false)
        this.progressCircle.setVisible(false)
        this.continueButton.setVisible(false)
        this.skipText.setVisible(false)
        this.textRescueTime.setScale(0).setAlpha(0)
    }

    private runAnim() {
        this.tweenTextRescueTime.play()

        this.skipText.setVisible(true)

        this.skipTextTween.play()

        this.tweenContinueButton.play()
    }

    private updateInfo() {
        const state = this.scene.storage.getState()
        const gamePlayStats = getGameplayCurrentStats(state)

        this.textRescueTime.setText(String(gamePlayStats.score || 0))
    }

    private handleShowRewardedVideoAd = async () => {
        const { globalScene, lang, audio } = this.scene.game

        this.countdownTimer.remove()

        try {
            if (this.isUseRescue) return

            this.isUseRescue = true

            globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
                message: lang.Text.LOADING_AD,
                duration: 0,
                loading: true,
            })

            audio.pauseMusic()
            audio.muteAll()

            audio.stopSound(SOUND_EFFECT.RESCUE_TIME)

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

            audio.unmuteAll()
            audio.playMusic()

            this.scene.storage.dispatch(useRescue())

            this.scene.analytics.showRewardedVideoAd(this.scene.getSceneName())

            globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)

            Emitter.emit(GAME_EVENT.RESCUE)

            this.scene.screen.close(this.name)

            this.scene.audio.playSound(SOUND_EFFECT.DAILY_REWARD)

            globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
        } catch (error) {
            if (error instanceof Object && GameCore.Utils.Object.hasOwn(error, 'code')) {
                if (error.code === 'USER_INPUT') {
                    this.showNotifySkipAds()
                    return
                }
            }

            this.showNotifyNoAds()
        } finally {
            this.adsTimer?.destroy()
            audio.unmuteAll()
            audio.playMusic()

            this.scene.ads.preloadRewardedVideoAsync().catch((ex) => console.log(ex))
        }
    }

    private setTime(time: number): void {
        this.textRescueTime.setText(`${time}`)

        Phaser.Display.Align.In.Center(this.textRescueTime, this.zone, 0, -42)
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

        this.countdownTimer.remove()
        this.scene.screen.close(this.name)
        this.scene.endGame()
    }

    private handleSkip = (): void => {
        this.countdownTimer.remove()

        this.scene.screen.close(this.name)
        this.scene.endGame()
    }

    private createPopup(): void {
        this.popup = new Popup(this.scene, 0, -5, 290, 310)

        this.add(this.popup)
    }

    private createContent(): void {
        this.createTitle()

        this.createTextRescueTime()

        this.createBgProgressCircle()

        this.createProgressCircle()

        this.createContinueButton()

        this.createSkipText()
    }

    private createTitle(): void {
        const titleContainer = this.scene.add.container()
        const scale = this.scene.world.getPixelRatio()

        const title = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_SECOND_CHANGE,
        })

        title.setWorldSize(title.width / scale, title.height / scale)

        Phaser.Display.Align.In.Center(title, titleContainer, 0, 12)

        titleContainer.add([title])

        this.popup.add(titleContainer)

        Phaser.Display.Align.In.TopCenter(titleContainer, this.popup, 0, -2)
    }

    private createTextRescueTime(): void {
        this.textRescueTime = this.scene.make.bitmapText({
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(140),
            origin: { x: 0.5, y: 0.5 },
        })

        this.textRescueTime.setOrigin(0.5).setScale(0).setAlpha(0)

        this.add(this.textRescueTime)

        Phaser.Display.Align.In.Center(this.textRescueTime, this, 0, -40)

        this.tweenTextRescueTime = this.scene.tweens.add({
            delay: 100,
            targets: this.textRescueTime,
            paused: true,
            duration: 200,
            scale: {
                from: 0,
                to: 1,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            ease: 'Power1',
        })
    }

    private createProgressCircle(): void {
        this.progressCircle = this.scene.add.graphics()

        this.add(this.progressCircle)
    }

    private setProgressCircle(angle: number): void {
        const progressAngle = -90
        const startAngle = Phaser.Math.DegToRad(progressAngle)
        const endAngle = Phaser.Math.DegToRad(angle - 360 + progressAngle)

        this.progressCircle.clear()

        this.progressCircle.beginPath()
        this.progressCircle.lineStyle(7, 0xffc600)
        this.progressCircle.arc(0, -44, 54, startAngle, endAngle, true, 0.02)
        this.progressCircle.strokePath()
        this.progressCircle.closePath()
    }

    private runCountdown(): void {
        this.startProgressCircle()

        const config = {
            delay: 1000,
            loop: true,
            callback: this.handleRunCountdown,
        }

        this.countdownTimer = this.scene.time.addEvent(config)
    }

    private startProgressCircle(): void {
        this.scene.tweens.addCounter({
            from: 0,
            to: 360,
            duration: Match.RescueGamePopupTimeout * 1000,
            onUpdate: (tween) => {
                const angle = +tween.getValue().toFixed(2)

                this.setProgressCircle(angle)
            },
            onComplete: () => {
                this.setProgressCircle(0)
                this.progressCircle.setAlpha(1)
            },
        })
    }

    private createBgProgressCircle(): void {
        this.bgProgress = this.scene.make.image({
            key: KEY,
            frame: FRAME.BG_PROGRESS_CIRCLE,
        })

        this.bgProgress.setWorldSize(115, 115)

        this.popup.add(this.bgProgress)

        Phaser.Display.Align.In.Center(this.bgProgress, this.popup, 0, -38)
    }

    private handleRunCountdown = (): void => {
        this.countdownCount -= 1

        if (this.countdownCount <= 0) {
            this.rescueTimeout()
            return
        }

        this.setTime(this.countdownCount)
    }

    private rescueTimeout(): void {
        this.countdownTimer.remove()
        this.scene.screen.close(this.name)
        this.scene.endGame()
    }

    private createContinueButton(): void {
        this.continueButton = new ContinueButton(this.scene)

        this.continueButton.setScale(0).setAlpha(0)

        this.continueButton.onClick = this.handleShowRewardedVideoAd

        this.add(this.continueButton)

        Phaser.Display.Align.In.Center(this.continueButton, this.textRescueTime, 0, 115)

        this.tweenContinueButton = this.scene.tweens.add({
            paused: true,
            targets: this.continueButton,
            ease: EaseBubbleOut,
            props: {
                alpha: { from: 0, to: 1 },
                scale: { from: 1.2, to: 1 },
            },
            delay: 300,
            duration: 300,
        })
    }

    private createSkipText(): void {
        this.skipText = new SkipButton(this.scene)

        this.skipText.setVisible(false).setAlpha(0)

        this.skipText.onClick = this.handleSkip

        this.add(this.skipText)

        Phaser.Display.Align.In.BottomCenter(this.skipText, this.continueButton, 0, 43.5)

        this.skipTextTween = this.scene.tweens.add({
            targets: this.skipText,
            delay: Match.DelayNoThank,
            paused: true,
            alpha: {
                from: 0,
                to: 1,
            },
            ease: 'Power1',
            duration: 500,
        })
    }

    private runOpenAnimation(): void {
        if (this.popupShowUpAnimation?.tween?.isPlaying()) return

        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.runPopupEntrancesAnimation(0, 300)
        this.runFadeInMaskAnimation(100, 300)
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
                onComplete: () => {
                    this.bgProgress.setVisible(true)
                    this.progressCircle.setVisible(true)
                    this.continueButton.setVisible(true)
                    this.skipText.setVisible(true)

                    this.runAnim()

                    this.updateInfo()

                    this.isUseRescue = false

                    this.countdownCount = Match.RescueGamePopupTimeout

                    this.setTime(this.countdownCount)

                    this.runCountdown()
                },
            })
        }

        this.popupShowUpAnimation.play()
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
            })
        }

        this.popupFadeOutMaskAnimation.play()
    }
}

export default RescueScreen
