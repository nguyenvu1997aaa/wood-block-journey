import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import GameScene from '../JourneyScene'

const { KEY, FRAME } = SPRITES.GAMEPLAY

class MainScoreBlock extends Phaser.GameObjects.Container {
    public scene: GameScene
    public scoreText: Phaser.GameObjects.BitmapText
    public background: Phaser.GameObjects.Image
    public tweenShow: Phaser.Tweens.Tween
    public tweenHide: Phaser.Tweens.Tween
    public addScore: Phaser.Tweens.Tween
    public score = 0

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene

        this.scene.add.existing(this)

        this.createBackground()

        this.createScoreText()
    }

    private createBackground(): void {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.BG_MAIN_SCORE,
        })

        this.background.setWorldSize(187, 48)

        this.add(this.background)

        Phaser.Display.Align.In.Center(this.background, this)
    }

    private createScoreText(): void {
        this.scoreText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(52),
            text: '0',
            origin: { x: 0.5, y: 0.5 },
        })

        this.add(this.scoreText)

        Phaser.Display.Align.In.Center(this.scoreText, this.background)
    }

    public setScore(score: number): void {
        this.score = score
    }

    public setScoreText(score: number): void {
        this.scoreText.setText(String(score))
    }

    public animAddScore(score: number): void {
        if (this.addScore && this.addScore.isPlaying()) {
            this.addScore.stop()
            const totalScore = this.score + score
            this.setScore(totalScore)
            this.setScoreText(totalScore)
        }

        this.addScore = this.scene.tweens.addCounter({
            from: 0,
            to: score,
            duration: 100,
            onUpdate: (tween) => {
                const value = this.score + Math.floor(tween.getValue())
                this.setScoreText(value)
                this.scene.updateProgressTargetScore(value)
            },
            onComplete: () => {
                const totalScore = this.score + score
                this.setScore(totalScore)
                this.setScoreText(totalScore)
                this.scene.handleCompleteScoreMission()
            },
        })
    }

    public reset(): void {
        this.setScore(0)
        this.setScoreText(0)
    }
}

export default MainScoreBlock
