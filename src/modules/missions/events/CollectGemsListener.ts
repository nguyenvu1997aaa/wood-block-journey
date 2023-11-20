import Emitter from '@/utils/emitter'
import MISSIONS from '../constants/Missions'
import BaseListener from './BaseListener'

const { EVENTS, TYPES } = MISSIONS

class CollectGemsListener extends BaseListener {
    constructor(game: Phaser.Game, name: string) {
        super(game, TYPES.COLLECT_GEMS, name)
    }

    protected initEvents(): void {
        Emitter.off(EVENTS.MISSION_UPDATE, this.process)
        Emitter.on(EVENTS.MISSION_UPDATE, this.process)
    }

    protected processMore(): boolean {
        return true
    }
}

export default CollectGemsListener
