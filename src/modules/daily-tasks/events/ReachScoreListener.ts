import Emitter from '@/utils/emitter'
import TASKS from '../constants/Tasks'
import BaseListener from './BaseListener'

const { ID, EVENTS } = TASKS.REACH_SCORE

class ReachScoreListener extends BaseListener {
    private totalScore: number
    private lastUpdate: number

    constructor(game: Phaser.Game) {
        super(game, ID)

        this.totalScore = 0
        this.lastUpdate = Date.now()
    }

    protected initEvents(): void {
        Emitter.off(EVENTS.ADD_SCORE, this.process)
        Emitter.on(EVENTS.ADD_SCORE, this.process)
    }

    protected processMore(payload: ITaskEventPayload): boolean {
        const { value } = payload

        // Only update after 3s
        const now = Date.now()
        if (now - this.lastUpdate < 3000) {
            this.totalScore += value
            return false
        }

        payload.value += this.totalScore

        this.totalScore = 0
        this.lastUpdate = now

        return true
    }
}

export default ReachScoreListener
