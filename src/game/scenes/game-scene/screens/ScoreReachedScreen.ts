import TextSequenceAnim from '@/game/components/TextSequenceAnim'
import TextSequenceAnim2 from '@/game/components/TextSequenceAnim2'
import FONTS from '@/game/constants/resources/fonts'
import { ScreenDepth } from '@/game/constants/screens'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import StarSuperTwinkle from '@/game/effects/StarSuperTwinkle'
import GameScene from '..'

type TData = {
    duration: number
    onClose: Function
}

export default class ScoreReachedScreen extends GameCore.Screen {
    public scene: GameScene
    private textScoreReached: TextSequenceAnim | TextSequenceAnim2
    private closeTimerEvent: Phaser.Time.TimerEvent
    private tweenBackground: Phaser.Tweens.Tween
    private starSuperTwinkle: StarSuperTwinkle

    constructor(scene: GameScene, name: string, width?: number, height?: number) {
        super(scene, name, width, height)

        this.scene = scene

        this.setDepth(ScreenDepth.POPUP)

        this.background.setAlpha(0)

        this.createContent()
    }

    public open = (data: TData): void => {
        super.open(data)

        this.scene.enableInput()

        this.runPopupEntrancesAnimation(300, 300)

        this.textScoreReached.restart()

        this.scene.audio.playSound(SOUND_EFFECT.SCORE_REACHED)
    }

    public close = (): void => {
        super.close()
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
                    this.textScoreReached.start()

                    this.starSuperTwinkle.playConfettiAnimation()

                    this.handleDelegate()

                    this.runAnim()
                },
            })
        }

        this.tweenBackground.play()
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
        this.createAnim()
    }

    private createText(): void {
        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            this.textScoreReached = new TextSequenceAnim2(this.scene, {
                text: this.scene.lang.Text.SCORE_REACHED,
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(180),
            })
        } else {
            this.textScoreReached = new TextSequenceAnim(this.scene, {
                text: this.scene.lang.Text.SCORE_REACHED,
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(70),
            })
        }

        this.add(this.textScoreReached)

        Phaser.Display.Align.In.Center(this.textScoreReached, this)
    }

    private createAnim(): void {
        this.starSuperTwinkle = new StarSuperTwinkle(this.scene)

        this.add(this.starSuperTwinkle)
        this.add(this.starSuperTwinkle.getImages())
    }
}
