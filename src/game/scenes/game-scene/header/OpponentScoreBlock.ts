import { getChallengeMatchOpponentInfo } from '@/modules/match/selectors/match'
import { getGameplayStats } from '@/modules/match/selectors/stats'
import GameScene from '../GameScene'
import ScoreBlock from './ScoreBlock'

class OpponentScoreBlock extends ScoreBlock {
    constructor(scene: GameScene) {
        super(scene)

        this.initScoreBlockAvatar()

        this.scene.add.existing(this)
    }

    public updateInfo(): void {
        const state = this.scene.storage.getState()
        const dataStats = getGameplayStats(state)
        const { playerId, photo } = getChallengeMatchOpponentInfo(state)

        const { score = 0 } = dataStats[playerId] || {}

        this.textScore.setText(String(score))
        this.avatar.loadPhoto(playerId, photo)
    }
}

export default OpponentScoreBlock
