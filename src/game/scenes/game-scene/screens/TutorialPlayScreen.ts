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

class TutorialPlayScreen extends GameCore.Screen {
    private popup: Popup
    private contents: Phaser.GameObjects.Group
    private buttonPlay: Button
    private messageText: Phaser.GameObjects.BitmapText

    private popupShowUpAnimation: ShowUpAnimation
    private contentShowUpAnimation: BubbleTouchAnimation
    private popupFadeOutAnimation: FadeOutAnimation

    private onPlay: Function

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

        const [onPlay] = this.getData(['onPlay'])

        this.onPlay = onPlay

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
        this.createMessage()
        this.createButtonPlay()

        this.contents = this.scene.make.group({})

        this.contents.addMultiple([this.messageText, this.buttonPlay])
    }

    private createButtonPlay(): void {
        this.buttonPlay = new Button(this.scene, KEY, FRAME.BUTTON_GREEN_LARGE, 170, 55)

        this.buttonPlay.setName('Play')

        const text = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(60),
            text: this.scene.lang.Text.PLAY,
            origin: { x: 0.5, y: 0.5 },
        })

        this.buttonPlay.add(text)

        Phaser.Display.Align.In.Center(text, this.buttonPlay)

        this.popup.add(this.buttonPlay)

        Phaser.Display.Align.In.Center(this.buttonPlay, this.popup, 0, 50)

        this.buttonPlay.onClick = this.handlePlay
    }

    private createMessage(): void {
        this.messageText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(40),
            origin: { x: 0.5, y: 0.5 },
            text: 'The game will end when there s no\nmore space for your given blocks.',
        })

        this.messageText.align = 1

        this.popup.add(this.messageText)

        Phaser.Display.Align.In.Center(this.messageText, this.popup, 0, -45)

        this.messageText.setScale(0).setAlpha(0)
    }

    // Exits animations
    private runPopupExitsAnimation(delay: number, duration: number): void {
        if (!this.popupFadeOutAnimation) {
            this.popupFadeOutAnimation = new FadeOutAnimation({
                targets: [this.popup],
                delay,
                duration,
                props: {
                    y: 250,
                    scale: 0,
                },
                onComplete: () => {
                    this.popup.setY(0)
                },
            })
        }

        this.popupFadeOutAnimation?.play()
    }

    private handlePlay = (): void => {
        if (this.onPlay) this.onPlay()

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
                    y: { from: 350, to: y },
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

export default TutorialPlayScreen
