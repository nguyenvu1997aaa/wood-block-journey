import TextSequenceAnim from '@/game/components/TextSequenceAnim'
import TextSequenceAnim2 from '@/game/components/TextSequenceAnim2'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { ScreenDepth } from '@/game/constants/screens'
import JourneyScene from '..'
import { TARGET_SCORE } from '../constant/target'

const { KEY } = SPRITES.GAMEPLAY_32

type TData = {
    duration: number
    onClose: Function
}

export default class CollectionCompletedScreen extends GameCore.Screen {
    public scene: JourneyScene
    private textWellDone: TextSequenceAnim | TextSequenceAnim2
    private listTargetFrame: Phaser.GameObjects.Image[] = []
    private listAnim: Phaser.Tweens.Tween[] = []
    private closeTimerEvent: Phaser.Time.TimerEvent
    private tweenBackground: Phaser.Tweens.Tween

    constructor(scene: JourneyScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0)

        this.createContent()
    }

    public open = (data: TData): void => {
        super.open(data)
        this.runPopupEntrancesAnimation(0, 300)
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
                    if (this.visible) {
                        this.scene.screen.close(this.name)
                    }

                    if (onClose) onClose()
                },
            })
        }
    }

    private runAnim() {
        //
    }

    private createContent(): void {
        this.createText()
    }

    private createText(): void {
        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            this.textWellDone = new TextSequenceAnim2(this.scene, {
                text: this.scene.lang.Text.WELL_DONE,
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(180),
            })
        } else {
            this.textWellDone = new TextSequenceAnim(this.scene, {
                text: this.scene.lang.Text.WELL_DONE,
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(80),
            })
        }

        this.add(this.textWellDone)

        Phaser.Display.Align.In.Center(this.textWellDone, this)
    }

    private createTargetItems(): void {
        const { header } = this.scene.layoutManager.objects
        const targetKeys = header.collectItems.getTargetKeys()

        if (!targetKeys || targetKeys.length === 0) return

        for (let i = 0; i < 3; i++) {
            const image = this.scene.make.image({
                key: KEY,
            })

            image.setWorldSize(30, 30)
            image.setFrame(targetKeys[i] || targetKeys[0])
            image.setVisible(false).setAlpha(0)

            this.listTargetFrame.push(image)
        }

        this.add(this.listTargetFrame)
    }

    private updateTargetItems(): void {
        const { header } = this.scene.layoutManager.objects
        const targetKeys = header.collectItems.getTargetKeys()

        if (!targetKeys || targetKeys.length === 0) return

        for (let i = 0; i < 3; i++) {
            const image = this.listTargetFrame[i]

            image.setWorldSize(30, 30)
            image.setFrame(targetKeys[i] || targetKeys[0])
            image.setVisible(false).setAlpha(0)
        }
    }

    private createAnimTargetItems(): void {
        const delay = [100, 500, 700]
        const positionX = [-120, 0, 120]
        const positionY = [-100, -150, -100]
        const scale = [0.7, 1, 0.7]

        if (this.scene.targetMissionManager.getTargetType() == TARGET_SCORE) return

        for (let i = 0; i < 3; i++) {
            this.listTargetFrame[i].setAlpha(0).setVisible(true)

            const anim = this.scene.add.tween({
                targets: this.listTargetFrame[i],
                delay: delay[i],
                x: {
                    from: 0,
                    to: positionX[i],
                },
                y: {
                    from: 300,
                    to: positionY[i],
                },
                alpha: {
                    from: 0,
                    to: 1,
                },
                scale: {
                    from: 0,
                    to: scale[i],
                },
                rotation: {
                    from: -180,
                    to: 0,
                },
                duration: 500,
            })

            this.listAnim.push(anim)
        }
    }

    private playAnimTargetItems(): void {
        if (this.scene.targetMissionManager.getTargetType() == TARGET_SCORE) return

        for (let i = 0; i < 3; i++) {
            this.listTargetFrame[i].setAlpha(0).setVisible(true)

            const anim = this.listAnim[i]

            anim.play()
        }
    }

    private runPopupEntrancesAnimation(delay: number, duration: number): void {
        this.listTargetFrame.forEach((element) => {
            element.setAlpha(0)
        })
        this.textWellDone.restart()

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
                    this.textWellDone.start()

                    if (this.listTargetFrame.length === 0) {
                        this.createTargetItems()

                        this.createAnimTargetItems()
                    } else {
                        this.updateTargetItems()

                        this.playAnimTargetItems()
                    }

                    this.handleDelegate()

                    this.runAnim()
                },
            })
        }
        this.background.setAlpha(0)
        this.tweenBackground.play()
    }
}
