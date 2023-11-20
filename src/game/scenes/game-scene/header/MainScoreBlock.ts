import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import GameScene from '../GameScene'

const { KEY, FRAME } = SPRITES.GAMEPLAY

class MainScoreBlock extends Phaser.GameObjects.Container {
    public scene: GameScene
    public scoreText: Phaser.GameObjects.BitmapText
    public background: Phaser.GameObjects.Image
    public tweenShow: Phaser.Tweens.Tween
    public tweenHide: Phaser.Tweens.Tween
    public addScore: Phaser.Tweens.Tween
    public score: number

    public currentScore = 0

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

        Phaser.Display.Align.In.Center(this.background, this, 0, -1)
    }

    private createScoreText(): void {
        this.scoreText = this.scene.make.bitmapText({
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(52),
            text: '0',
            origin: { x: 0.5, y: 0.5 },
        })

        this.add(this.scoreText)

        Phaser.Display.Align.In.Center(this.scoreText, this.background, 0, 3)
    }

    public setScore(score: number): void {
        this.score = score
    }

    public setScoreText(score: number): void {
        this.scoreText.setText(String(score))
    }

    public animAddScore(score: number): void {
        const { header } = this.scene.layoutManager.objects

        const totalScore = this.score + score
        this.currentScore = totalScore
        this.setScore(totalScore)
        if (this.addScore && this.addScore.isPlaying()) {
            this.addScore.remove()
            this.setScoreText(totalScore)
        }

        this.addScore = this.scene.tweens.addCounter({
            from: this.score - score,
            to: this.score,
            duration: 100,
            ease: Phaser.Math.Easing.Sine.Out,
            onUpdate: (tween) => {
                const value = Math.floor(tween.getValue())
                this.setScoreText(value)
                header.bestScoreBlock.updateBestScoreText(value)
                this.scene.updateProgressTargetScore(value)
            },
            onComplete: () => {
                this.setScoreText(this.score)
                header.bestScoreBlock.updateBestScoreText(this.score)

                if (this.scene.tutorialManager.isRunning()) {
                    // this.scene.time.delayedCall(1000, () => {
                    this.scene.tutorialManager.nextTutorial()
                    // })

                    return
                }

                this.scene.handleNextTargetScore()

                this.scene.bestScoreReached()
            },
        })
    }
}

export default MainScoreBlock
