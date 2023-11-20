import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Popup from '@/game/components/Popup'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import JourneyScene from '..'

const { KEY, FRAME } = SPRITES.DEFAULT

type TData = {
    jsonTarget: string
    duration: number
}

class TargetScoreScreen extends GameCore.Screen {
    public scene: JourneyScene
    private popup: Popup
    private title: Phaser.GameObjects.Container
    private contents: Phaser.GameObjects.Group
    private backgroundContent: Phaser.GameObjects.Image

    private textTargetScore: Phaser.GameObjects.BitmapText
    private textScore: Phaser.GameObjects.BitmapText
    private titleFrame: Phaser.GameObjects.Image

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    constructor(scene: JourneyScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.createPopup()
        this.createTitle()
        this.createContentBackground()
        this.createTextTargetScore()
        this.createTextScore()

        this.addItem()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)
    }

    public open(data: TData): void {
        super.open(data)

        const targetScore = this.scene.levelManager.getCurrentTargetScore()
        const currentLevel = this.scene.levelManager.getCurrentIndex()
        const imageScale = this.scene.world.getPixelRatio()

        this.textScore.setText(`${targetScore}`)

        if (currentLevel === 0) {
            this.titleFrame.setFrame(FRAME.TEXT_FIRST_MILESTONE)
            // this.titleFrame.setWorldSize(166, 20)
        } else {
            this.titleFrame.setFrame(FRAME.TEXT_NEXT_MILESTONE)
            // this.titleFrame.setWorldSize(234.5, 24.5)
        }

        this.titleFrame.setWorldSize(
            this.titleFrame.width / imageScale,
            this.titleFrame.height / imageScale
        )

        const [duration] = this.getData(['duration'])

        this.runOpenAnimation()

        this.scene.time.delayedCall(duration, () => {
            this.handleClose()
        })
    }

    private handleClose = (): void => {
        this.runCloseAnimation()
    }

    private createContentBackground(): void {
        this.backgroundContent = this.scene.make.image({
            key: KEY,
            frame: FRAME.POPUP_CONTENT_BACKGROUND,
        })

        this.backgroundContent.setWorldSize(263, 135)

        this.popup.add(this.backgroundContent)

        Phaser.Display.Align.In.TopCenter(this.backgroundContent, this.popup, 0, -24)
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

        Phaser.Display.Align.In.Center(this.textTargetScore, this.backgroundContent, 0, -30)
    }

    private createTextScore(): void {
        this.textScore = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(80),
            text: '0',
            origin: { x: 0.5, y: 0.5 },
        })

        this.popup.add(this.textScore)

        Phaser.Display.Align.In.Center(this.textScore, this.backgroundContent, 0, 15)
    }

    private createPopup() {
        this.popup = new Popup(this.scene, 0, -19, 290, 218, {
            forceHeightTop: 55,
        })
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone)
    }

    private createTitle() {
        const imageScale = this.scene.world.getPixelRatio()

        this.title = this.scene.add.container()

        this.titleFrame = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_FIRST_MILESTONE,
        })

        this.titleFrame.setWorldSize(
            this.titleFrame.width / imageScale,
            this.titleFrame.height / imageScale
        )

        this.title.add([this.titleFrame])

        this.popup.add(this.title)

        Phaser.Display.Align.In.Center(this.titleFrame, this.title, 0, -10)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup)
    }

    private addItem() {
        this.popup.add([this.title])

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

                    this.scene.startGameAfterTargetScoreScreenClose()
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

export default TargetScoreScreen
