import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Button from '@/game/components/Button'
import LivesTimer from '@/game/components/LivesTimer'
import Popup from '@/game/components/Popup'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneKeys } from '@/game/constants/scenes'
import { ScreenDepth, ScreenKeys } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import { getLives } from '@/modules/lives/selectors/lives'
import JourneyScene from '..'
import RetryButton from './component/RetryButton'

const { KEY, FRAME } = SPRITES.DEFAULT

export default class MissionFailScreen extends GameCore.Screen {
    public scene: JourneyScene

    private popup: Popup
    private title: Phaser.GameObjects.Container
    private buttonBack: Button
    private buttonRetry: RetryButton
    private contents: Phaser.GameObjects.Group

    private backgroundContent: Phaser.GameObjects.Image
    private textLevelFail: Phaser.GameObjects.Image
    private buttonClose: Button

    private livesTimer: LivesTimer

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    constructor(scene: JourneyScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.createPopup()
        this.createContentBackground()

        this.createTitle()
        this.createTexts()
        this.createButtons()

        this.createLivesTimer()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)
    }

    public open(): void {
        super.open()

        this.scene.enableInput()

        this.runOpenAnimation()
    }

    private createPopup() {
        this.popup = new Popup(this.scene, 0, 0, 290, 234)

        this.add(this.popup)

        this.popup.setFrameTop(FRAME.POPUP_TOP_DARK)

        Phaser.Display.Align.In.Center(this.popup, this.zone, 0, -20)
    }

    private createContentBackground(): void {
        this.backgroundContent = this.scene.make.image({
            key: KEY,
            frame: FRAME.POPUP_CONTENT_BACKGROUND,
        })

        this.backgroundContent.setWorldSize(260, 147)

        this.popup.add(this.backgroundContent)

        Phaser.Display.Align.In.TopCenter(this.backgroundContent, this.popup, 0, -66)
    }

    private createTitle() {
        this.title = this.scene.add.container()

        const scale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_LOSE,
        })

        text.setWorldSize(text.width / scale, text.height / scale)

        this.buttonClose = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)

        this.buttonClose.setName('Close')

        this.buttonClose.onClick = this.clickButtonClose.bind(this)

        this.title.add([text, this.buttonClose])

        this.popup.add(this.title)

        Phaser.Display.Align.In.Center(text, this.title, 0, 30)

        Phaser.Display.Align.In.Center(this.buttonClose, this.title, 135, 5)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup)
    }

    private createTexts(): void {
        this.createTextLevelFail()
    }

    private createTextLevelFail(): void {
        const scale = this.scene.world.getPixelRatio()

        this.textLevelFail = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_LEVEL_FAIL,
        })

        this.textLevelFail.setWorldSize(
            this.textLevelFail.width / scale,
            this.textLevelFail.height / scale
        )

        this.popup.add(this.textLevelFail)

        Phaser.Display.Align.In.Center(this.textLevelFail, this.popup, 0, -10)
    }

    private createButtons(): void {
        this.createButtonBack()
        this.createButtonRetry()
    }

    private createButtonBack(): void {
        const iconBack = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_BACK,
        })

        iconBack.setWorldSize(30, 30)

        this.buttonBack = new Button(this.scene, KEY, FRAME.BUTTON_MINOR, 62, 54)

        this.buttonBack.setName('Back')

        this.buttonBack.add(iconBack)

        this.popup.add(this.buttonBack)

        this.buttonBack.onClick = this.clickButtonBack.bind(this)

        Phaser.Display.Align.In.Center(this.buttonBack, this.popup, -90, 52)
    }

    private clickButtonBack(): void {
        // this.close()
        this.runCloseAnimation()

        this.scene.time.delayedCall(300, () => {
            this.scene.clearFen()
            this.scene.scene.switch(SceneKeys.LEVEL_SCENE)
        })
    }

    private createButtonRetry(): void {
        this.buttonRetry = new RetryButton(this.scene)

        this.popup.add(this.buttonRetry)

        this.buttonRetry.onClick = this.clickButtonRetry.bind(this)

        Phaser.Display.Align.In.Center(this.buttonRetry, this.popup, 33, 52)
    }

    private clickButtonClose(): void {
        // this.close()
        this.runCloseAnimation()

        this.scene.time.delayedCall(300, () => {
            this.scene.clearFen()
            this.scene.scene.switch(SceneKeys.LEVEL_SCENE)
        })
    }

    private clickButtonRetry(): void {
        // this.close()
        const state = this.scene.storage.getState()
        const playerLives = getLives(state)

        if (playerLives < 1) {
            this.scene.screen.open(ScreenKeys.CLAIM_HEART_SCREEN, { currentScreen: this })
            return
        }

        // this.scene.storage.dispatch(decreaseLife())

        this.runCloseAnimation()

        this.scene.time.delayedCall(300, () => {
            this.scene.handleRetryLevel()
        })
    }

    private createLivesTimer(): void {
        this.livesTimer = new LivesTimer(this.scene)

        this.livesTimer.startIntervalTimer()

        this.livesTimer.setFrameLivesTimeBlock2()

        this.add(this.livesTimer)

        Phaser.Display.Align.In.TopCenter(this.livesTimer, this, 0, -62)
    }

    // Animations
    private runOpenAnimation(): void {
        if (this.popupShowUpAnimation?.tween?.isPlaying()) return

        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.livesTimer.startIntervalTimer()

        this.runPopupEntrancesAnimation(0, 300)
        this.runFadeInMaskAnimation(100, 300)
        // this.runPopupContentEntrancesAnimation(200, 300)
    }

    private runCloseAnimation(): void {
        if (this.popupFadeOutAnimation?.tween?.isPlaying()) return

        this.livesTimer.stopIntervalTimer()

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
            })
        }

        this.popupFadeOutMaskAnimation.play()
    }
}
