import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Popup from '@/game/components/Popup'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import Button from '../components/Button'

const { KEY, FRAME } = SPRITES.DEFAULT

type TData = {
    onConfirm: Function
}

class StartOverScreen extends GameCore.Screen {
    private popup: Popup
    private title: Phaser.GameObjects.Container
    private contents: Phaser.GameObjects.Group
    private backgroundContent: Phaser.GameObjects.Image

    private textTargetScore: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text

    private popupShowUpAnimation: ShowUpAnimation
    private popupFadeOutAnimation: FadeOutAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeInMaskAnimation: FadeInAnimation
    private popupFadeOutMaskAnimation: FadeOutAnimation

    constructor(scene: Phaser.Scene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.createPopup()
        this.createTitle()
        this.createContentBackground()
        this.createTextTargetScore()
        this.createButtons()

        this.addItem()

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0.5)
    }

    public open(data: TData): void {
        super.open(data)

        this.runOpenAnimation()
    }

    private handleClose = (): void => {
        this.runCloseAnimation()
    }

    private startOver = (): void => {
        const [onConfirm] = this.getData(['onConfirm'])

        onConfirm()

        this.handleClose()
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
        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            this.textTargetScore = this.scene.make.text({
                text: this.scene.lang.Text.MESS_START_OVER,
                style: {
                    fontFamily: FONTS.FONT_FAMILY,
                    fontSize: `${this.scene.fontSize(40)}px`,
                },
                origin: { x: 0.5, y: 0.5 },
            })

            this.textTargetScore.setTint(0x73391a)

            this.textTargetScore.setAlign('center')
        } else {
            this.textTargetScore = this.scene.make.bitmapText({
                font: FONTS.PRIMARY.KEY,
                size: this.scene.fontSize(40),
                text: this.scene.lang.Text.MESS_START_OVER,
                origin: { x: 0.5, y: 0.5 },
            })

            this.textTargetScore.setCenterAlign()
        }

        this.popup.add(this.textTargetScore)

        Phaser.Display.Align.In.Center(this.textTargetScore, this.backgroundContent, 0, -30)
    }

    private createButtons(): void {
        const buttonOK = new Button(this.scene, KEY, FRAME.BUTTON_GREEN_BIG, 89, 41)
        const buttonCancel = new Button(this.scene, KEY, FRAME.BUTTON_DARK_BLUE_BIG, 89, 41)

        const locale = this.scene.facebook.getLocale()

        let textOK
        let textCancel

        if (locale == 'ar') {
            textOK = this.scene.make.text({
                text: this.scene.lang.Text.OK,
                style: {
                    fontFamily: FONTS.FONT_FAMILY,
                    fontSize: `${this.scene.fontSize(40)}px`,
                },
                origin: { x: 0.5, y: 0.5 },
            })

            textCancel = this.scene.make.text({
                text: this.scene.lang.Text.CANCEL,
                style: {
                    fontFamily: FONTS.FONT_FAMILY,
                    fontSize: `${this.scene.fontSize(40)}px`,
                },
                origin: { x: 0.5, y: 0.5 },
            })

            textOK.setTint(0xeed3b2)
            textCancel.setTint(0xeed3b2)
        } else {
            textOK = this.scene.make.bitmapText({
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(40),
                text: this.scene.lang.Text.OK,
                origin: { x: 0.5, y: 0.5 },
            })

            textCancel = this.scene.make.bitmapText({
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(40),
                text: this.scene.lang.Text.CANCEL,
                origin: { x: 0.5, y: 0.5 },
            })
        }

        buttonOK.add(textOK)

        buttonCancel.add(textCancel)

        this.popup.add([buttonOK, buttonCancel])

        buttonOK.onClick = this.startOver
        buttonCancel.onClick = this.handleClose

        Phaser.Display.Align.In.Center(buttonOK, this.backgroundContent, -60, 30)
        Phaser.Display.Align.In.Center(buttonCancel, this.backgroundContent, 60, 30)
    }

    private createPopup() {
        this.popup = new Popup(this.scene, 0, -19, 290, 218, {
            forceHeightTop: 55,
        })
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone)
    }

    private createTitle() {
        this.title = this.scene.add.container()

        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            const textConfirm = this.scene.make.text({
                text: this.scene.lang.Text.CONFIRM_START_OVER,
                style: {
                    fontFamily: FONTS.FONT_FAMILY,
                    fontSize: `${this.scene.fontSize(38)}px`,
                },
                origin: { x: 0.5, y: 0.5 },
            })

            textConfirm.setTint(0xeed3b2)

            this.title.add([textConfirm])

            Phaser.Display.Align.In.Center(textConfirm, this.title, 0, -5)
        } else {
            const textConfirm = this.scene.make.bitmapText({
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(38),
                text: this.scene.lang.Text.CONFIRM_START_OVER,
                origin: { x: 0.5, y: 0.5 },
            })

            this.title.add([textConfirm])

            Phaser.Display.Align.In.Center(textConfirm, this.title, 0, -5)
        }

        this.popup.add(this.title)

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

export default StartOverScreen
