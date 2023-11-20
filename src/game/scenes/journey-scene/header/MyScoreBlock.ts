import GameScene from '../JourneyScene'
import ScoreBlock from './ScoreBlock'

class MyScoreBlock extends ScoreBlock {
    private addScore: Phaser.Tweens.Tween

    constructor(scene: GameScene) {
        super(scene)

        this.initScoreBlockAvatar()

        this.scene.add.existing(this)
    }

    public updateInfo(): void {
        const { playerId, photo } = this.scene.player.getPlayer()

        this.avatar.loadPhoto(playerId, photo)
    }

    public animAddScore(score: number) {
        if (this.addScore && this.addScore.isPlaying()) {
            this.addScore.stop()

            const totalScore = this.score + score

            this.setScore(totalScore)

            this.setScoreText(totalScore)
        }

        this.addScore = this.scene.tweens.addCounter({
            from: 0,
            to: score,
            duration: 1000,
            onUpdate: (tween) => {
                const value = this.score + Math.floor(tween.getValue())

                this.setScoreText(value)
            },
            onComplete: () => {
                const totalScore = this.score + score

                this.setScore(totalScore)

                this.setScoreText(totalScore)
            },
        })
    }
}

export default MyScoreBlock
