import Emitter from '@/utils/emitter'
import TASKS from '../constants/Tasks'
import BaseListener from './BaseListener'

const { ID, EVENTS } = TASKS.COLLECT_DIAMONDS

class CollectDiamondsListener extends BaseListener {
    constructor(game: Phaser.Game) {
        super(game, ID)
    }

    protected initEvents(): void {
        Emitter.off(EVENTS.COLLECT_DIAMONDS, this.process)
        Emitter.on(EVENTS.COLLECT_DIAMONDS, this.process)
    }

    protected processMore(): boolean {
        return true
    }
}

export default CollectDiamondsListener
