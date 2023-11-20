import Emitter from '@/utils/emitter'
import TASKS from '../constants/Tasks'
import BaseListener from './BaseListener'

const { ID, EVENTS } = TASKS.PASS_LEVELS

class PassLevelsListener extends BaseListener {
    constructor(game: Phaser.Game) {
        super(game, ID)
    }

    protected initEvents(): void {
        Emitter.off(EVENTS.PASS_LEVEL, this.process)
        Emitter.on(EVENTS.PASS_LEVEL, this.process)
    }

    protected processMore(): boolean {
        return true
    }
}

export default PassLevelsListener
