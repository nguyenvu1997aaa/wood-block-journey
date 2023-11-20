import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Popup from '@/game/components/Popup'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import GameScene from '..'
import ContinueButton from './component/ContinueButton'

const { KEY, FRAME } = SPRITES.DEFAULT

export default class NextTargetScoreScreen extends GameCore.Screen {
    public scene: GameScene

    private popup: Popup
    private title: Phaser.GameObjects.Container
    private buttonContinue: ContinueButton
    private contents: Phaser.GameObjects.Group

    private textTargetScore: Phaser.GameObjects.BitmapText
    private textScore: Phaser.GameObjects.BitmapText
    private backgroundContent: Phaser.GameObjects.Image

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    constructor(scene: GameScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.createPopup()
        this.createContentBackground()

        this.createTitle()
        this.createTexts()
        this.createButtons()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)
    }

    public open(): void {
        super.open()

        const score = this.scene.levelManager.getCurrentTargetScore()

        this.textScore.setText(`${score}`)

        this.runOpenAnimation()
    }

    private createPopup() {
        this.popup = new Popup(this.scene, 0, 0, 310, 300)
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone)
    }

    private createContentBackground(): void {
        this.backgroundContent = this.scene.make.image({
            key: KEY,
            frame: FRAME.POPUP_CONTENT_BACKGROUND,
        })

        this.backgroundContent.setWorldSize(280, 200)

        this.popup.add(this.backgroundContent)

        Phaser.Display.Align.In.TopCenter(this.backgroundContent, this.popup, 0, -55)
    }

    private createTitle() {
        this.title = this.scene.add.container()
        const scale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_NEXT_MILESTONE,
        })

        text.setWorldSize(text.width / scale, text.height / scale)

        this.title.add([text])

        this.popup.add(this.title)

        Phaser.Display.Align.In.Center(text, this.title, 0, 11)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup)
    }

    private createTexts(): void {
        this.createTextTargetScore()
        this.createTextScore()
    }

    private createTextTargetScore(): void {
        const text = this.scene.lang.Text
        this.textTargetScore = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(50),
            text: text.TARGET_SCORE,
            origin: { x: 0.5, y: 0.5 },
        })

        this.popup.add(this.textTargetScore)

        Phaser.Display.Align.In.Center(this.textTargetScore, this.popup, 0, -60)
    }

    private createTextScore(): void {
        this.textScore = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(80),
            text: '0',
            origin: { x: 0.5, y: 0.5 },
        })

        this.popup.add(this.textScore)

        Phaser.Display.Align.In.Center(this.textScore, this.popup, 0, -15)
    }

    private createButtons(): void {
        this.createButtonContinue()
    }

    private createButtonContinue(): void {
        this.buttonContinue = new ContinueButton(this.scene)

        this.popup.add(this.buttonContinue)

        this.buttonContinue.onClick = this.clickButtonContinue.bind(this)

        Phaser.Display.Align.In.Center(this.buttonContinue, this.popup, 0, 55)
    }

    private clickButtonContinue(): void {
        this.scene.nextLevel()
        this.runCloseAnimation()
    }

    // Animations
    private runOpenAnimation(): void {
        if (this.popupShowUpAnimation?.tween?.isPlaying()) return

        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.runPopupEntrancesAnimation(0, 300)
        this.runFadeInMaskAnimation(100, 300)
    }

    private runCloseAnimation(): void {
        if (this.popupFadeOutAnimation?.tween?.isPlaying()) return

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
                    const { main } = this.scene.layoutManager.objects
                    main.board.handleTweenStartMission()

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
