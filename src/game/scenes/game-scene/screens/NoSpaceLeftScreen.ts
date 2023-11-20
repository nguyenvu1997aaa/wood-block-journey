import TextSequenceAnim from '@/game/components/TextSequenceAnim'
import TextSequenceAnim2 from '@/game/components/TextSequenceAnim2'
import FONTS from '@/game/constants/resources/fonts'
import { ScreenDepth } from '@/game/constants/screens'
import GameScene from '..'

type TData = {
    duration: number
    onClose: Function
}

export default class NoSpaceLeftScreen extends GameCore.Screen {
    public scene: GameScene
    private textNoSpaceLeft: TextSequenceAnim | TextSequenceAnim2
    private closeTimerEvent: Phaser.Time.TimerEvent
    private tweenBackground: Phaser.Tweens.Tween

    constructor(scene: GameScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0)

        this.createContent()
    }

    public open = (data: TData): void => {
        super.open(data)

        this.runPopupEntrancesAnimation(300, 300)

        this.handleDelegate()
    }

    public close = (): void => {
        super.close()
    }

    private handleDelegate(): void {
        const [duration = 0, onClose] = this.getData(['duration', 'onClose'])

        this.closeTimerEvent?.remove()

        if (duration > 0) {
            this.closeTimerEvent = this.scene.time.addEvent({
                delay: duration,
                callback: () => {
                    this.textNoSpaceLeft.setVisible(false)
                    this.textNoSpaceLeft.restart()

                    if (this.visible) {
                        this.scene.screen.close(this.name)
                    }

                    if (onClose) onClose()
                },
            })
        }
    }

    private runAnim() {
        this.textNoSpaceLeft.setVisible(true)
        this.textNoSpaceLeft.start(300)
    }

    private createContent(): void {
        this.createText()
    }

    private createText(): void {
        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            this.textNoSpaceLeft = new TextSequenceAnim2(this.scene, {
                text: this.scene.lang.Text.NO_SPACE_LEFT,
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(180),
            })
        } else {
            this.textNoSpaceLeft = new TextSequenceAnim(this.scene, {
                text: this.scene.lang.Text.NO_SPACE_LEFT,
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(76),
            })
        }

        this.add(this.textNoSpaceLeft)

        Phaser.Display.Align.In.Center(this.textNoSpaceLeft, this)
    }

    private runPopupEntrancesAnimation(delay: number, duration: number): void {
        if (!this.tweenBackground) {
            this.tweenBackground = this.scene.tweens.addCounter({
                paused: true,
                from: 0,
                to: 0.6,
                delay,
                duration,
                onUpdate: (tween) => {
                    const value = tween.getValue()

                    this.background.setAlpha(value)
                },
                onComplete: () => {
                    this.runAnim()
                },
            })
        }

        this.tweenBackground.play()
    }
}
