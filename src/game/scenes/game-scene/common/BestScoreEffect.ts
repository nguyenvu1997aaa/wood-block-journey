import FONTS from '@/game/constants/resources/fonts'
import GameScene from '..'

export default class BestScoreEffect {
    public scene: GameScene
    private textScore: Phaser.GameObjects.BitmapText
    private tweenTextScore: Phaser.Tweens.Tween

    constructor(scene: GameScene) {
        this.scene = scene

        this.init()
    }

    private init(): void {
        this.createTextScore()
        this.createTweenMoveToScore()
    }

    private createTextScore(): void {
        this.textScore = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(60),
            origin: { x: 0.5, y: 0.5 },
            text: '0',
        })

        this.textScore.setVisible(false)

        Phaser.Display.Align.In.Center(this.textScore, this.scene.gameZone, 0, 46.5)
    }

    private createTweenMoveToScore(): void {
        const { width } = this.scene.gameZone
        const { header } = this.scene.layoutManager.objects

        this.tweenTextScore = this.scene.tweens.add({
            targets: [this.textScore],
            paused: true,
            duration: 600,
            ease: Phaser.Math.Easing.Sine.Out,
            props: {
                x: width / 2 - 132,
                y: 60,
                scale: 0.4,
                alpha: 0.5,
            },
            onComplete: () => {
                this.textScore.setVisible(false)

                const bestScore = this.scene.getCurrentScoreByMode()

                header.bestScoreBlock.setScoreText(bestScore)
            },
        })
    }

    public playAnimMoveToBestScoreBlock(): void {
        const bestScore = this.scene.getCurrentScoreByMode()

        this.textScore.setText(String(bestScore))
        this.textScore.setVisible(true)
        this.tweenTextScore.play()
    }
}
