import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import BubbleTouchAnimation from '@/game/animations/special/BubbleTouch'
import ShowUpAnimation from '@/game/animations/special/ShowUp'
import Button from '@/game/components/Button'
import Popup from '@/game/components/Popup'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'

const { KEY, FRAME } = SPRITES.DEFAULT

type TData = {
    bestScore: number
}

class AlertScreen extends GameCore.Screen {
    private popup: Popup
    private title: Phaser.GameObjects.Container
    private contents: Phaser.GameObjects.Group
    private buttonNo: Button
    private buttonYes: Button
    private messageText: Phaser.GameObjects.BitmapText
    private messageText2: Phaser.GameObjects.Text

    private popupShowUpAnimation: ShowUpAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeOutAnimation: FadeOutAnimation

    private onHandleYes: Function

    constructor(scene: Phaser.Scene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.setVisible(false)

        this.setDepth(ScreenDepth.POPUP)

        this.createPopup()
        this.createPopupContent()

        this.background.setAlpha(0.5)
    }

    public open = (data: TData): void => {
        super.open(data)

        this.setVisible(true)

        const [message = '', onHandleYes] = this.getData(['message', 'onHandleYes'])

        this.setTextMessage(message)

        this.onHandleYes = onHandleYes

        this.runOpenAnimation()
    }

    private runAnim(): void {
        this.messageText.setScale(0).setAlpha(0)
    }

    private createPopup(): void {
        this.popup = new Popup(this.scene, 0, 0, 325, 260)
        this.add(this.popup)

        Phaser.Display.Align.In.Center(this.popup, this.zone)
    }

    private createPopupContent(): void {
        this.createTitle()
        this.createMessage()
        this.createMessage2()
        this.createButtonNo()
        this.createButtonYes()

        this.popup.add([this.title])

        this.contents = this.scene.make.group({})

        this.contents.addMultiple([
            this.messageText,
            this.messageText2,
            this.buttonNo,
            this.buttonYes,
        ])
    }

    private createTitle(): void {
        this.title = this.scene.add.container()

        const imageScale = this.scene.world.getPixelRatio()
        const title = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_TUTORIAL,
        })

        const { width, height } = title

        title.setWorldSize(width / imageScale, height / imageScale)

        const close = new Button(this.scene, KEY, FRAME.BUTTON_CLOSE, 35, 35)
        close.onClick = this.handleClosePopup

        close.setName('Close')

        Phaser.Display.Align.In.Center(close, this.title, 155, -19)

        Phaser.Display.Align.In.Center(title, this.title, 0, 10)

        this.title.add([title, close])

        this.popup.add(this.title)

        Phaser.Display.Align.In.TopCenter(this.title, this.popup, 0, -2)
    }

    private createButtonNo(): void {
        this.buttonNo = new Button(this.scene, KEY, FRAME.BUTTON_DARK_BLUE, 120, 40)

        this.buttonNo.setName('No')

        const imageScale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_NO,
        })

        const { width, height } = text

        text.setWorldSize(width / imageScale, height / imageScale)

        this.buttonNo.add(text)

        Phaser.Display.Align.In.Center(text, this.buttonNo)

        this.popup.add(this.buttonNo)

        Phaser.Display.Align.In.Center(this.buttonNo, this.popup, 80, 60)

        this.buttonNo.onClick = this.handleNo
    }

    private createButtonYes(): void {
        this.buttonYes = new Button(this.scene, KEY, FRAME.BUTTON_GREEN_LARGE, 120, 40)

        this.buttonYes.setName('Yes')

        const imageScale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_YES,
        })

        const { width, height } = text

        text.setWorldSize(width / imageScale, height / imageScale)

        this.buttonYes.add(text)

        Phaser.Display.Align.In.Center(text, this.buttonYes)

        this.popup.add(this.buttonYes)

        Phaser.Display.Align.In.Center(this.buttonYes, this.popup, -80, 60)

        this.buttonYes.onClick = this.handleYes
    }

    private createMessage(): void {
        this.messageText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(45),
            origin: { x: 0.5, y: 0.5 },
        })

        this.messageText.align = 1

        this.popup.add(this.messageText)

        Phaser.Display.Align.In.Center(this.messageText, this.popup, 0, -40)

        this.messageText.setScale(0).setAlpha(0)
    }

    private createMessage2(): void {
        this.messageText2 = this.scene.make.text({
            style: {
                fontFamily: FONTS.FONT_FAMILY,
                fontSize: `${this.scene.fontSize(45)}px`,
            },
            origin: { x: 0.5, y: 0.5 },
        })

        this.messageText2.setTint(0x73391a)
        this.messageText2.setVisible(false)

        this.popup.add(this.messageText2)

        Phaser.Display.Align.In.Center(this.messageText2, this.popup, 0, -40)

        this.messageText2.setScale(0).setAlpha(0)
    }

    private handleClosePopup = (): void => {
        // this.scene.audio.playSound(SOUND_EFFECT.POPUP_OFF, { volume: 0.6 })
        this.runCloseAnimation()

        this.popupFadeOutAnimation.next(() => {
            this.scene.screen.close(this.name)
        })
    }

    private runCloseAnimation(): void {
        this.runPopupExitsAnimation(0, 200)
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
                },
            })
        }

        this.popupFadeOutAnimation?.play()
    }

    private setTextMessage(message: string): void {
        this.messageText.setText(`${message}`)

        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            this.messageText2.setText(`${message}`)
            this.messageText2.setVisible(true)
            this.messageText.setVisible(false)
        }
    }

    private handleNo = (): void => {
        this.close()
    }

    private handleYes = (): void => {
        if (this.onHandleYes) this.onHandleYes()
        this.close()
    }

    private runOpenAnimation(): void {
        this.scene.audio.playSound(SOUND_EFFECT.POPUP_SHOW)

        this.runPopupEntrancesAnimation(0, 300)
        this.runPopupContentEntrancesAnimation(200, 300)
    }

    // Entrances animations
    private runPopupEntrancesAnimation(delay: number, duration: number): void {
        if (!this.popupShowUpAnimation) {
            const { y, scale } = this.popup
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
        if (!this.contentShowUpAnimation) {
            this.contentShowUpAnimation = new BubbleTouchAnimation({
                targets: this.contents.getChildren(),
                duration,
                delay: this.scene.tweens.stagger(80, { start: delay }),
                props: {
                    alpha: { start: 0, from: 0, to: 1 },
                },
            })
        }

        this.contentShowUpAnimation.play()
    }
}

export default AlertScreen
