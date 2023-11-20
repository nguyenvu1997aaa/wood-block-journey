import { MATCH_MODE_CHALLENGE_FRIENDS } from '@/modules/match/constants/GameModes'
import { getGameplayCurrentStats } from '@/modules/match/selectors/stats'
import GameScene from '../GameScene'
import ScoreBlock from './ScoreBlock'

class MyScoreBlock extends ScoreBlock {
    public scene: GameScene
    private addScore: Phaser.Tweens.Tween
    public currentScore = 0

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene

        this.initScoreBlockAvatar()

        this.scene.add.existing(this)
    }

    public updateInfo(): void {
        const { playerId, photo } = this.scene.player.getPlayer()

        this.avatar.loadPhoto(playerId, photo)

        if (this.scene.gamePlayMode === MATCH_MODE_CHALLENGE_FRIENDS) {
            const state = this.scene.storage.getState()
            const dataStats = getGameplayCurrentStats(state)
            const { score = 0 } = dataStats[playerId] || {}

            this.textScore.setText(String(score))
        }
    }

    public animAddScore(score: number) {
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
            onUpdate: (tween) => {
                const value = Math.floor(tween.getValue())
                this.setScoreText(value)
                header.bestScoreBlock.updateBestScoreText(value)
                this.scene.updateProgressTargetScore(value)
            },
            onComplete: () => {
                this.setScore(this.score)
                header.bestScoreBlock.updateBestScoreText(this.score)

                this.setScoreText(totalScore)

                this.scene.handleNextTargetScore()

                this.scene.bestScoreReached()
            },
        })
    }
}

export default MyScoreBlock
