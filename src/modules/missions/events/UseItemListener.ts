import Emitter from '@/utils/emitter'
import MISSIONS from '../constants/Missions'
import BaseListener from './BaseListener'

const { EVENTS, TYPES } = MISSIONS

class UseItemListener extends BaseListener {
    constructor(game: Phaser.Game, name: string) {
        super(game, TYPES.USE_ITEM, name)
    }

    protected initEvents(): void {
        Emitter.off(EVENTS.MISSION_UPDATE, this.process)
        Emitter.on(EVENTS.MISSION_UPDATE, this.process)
    }

    protected processMore(payload: IMissionEventPayload): boolean {
        console.log('UseItem', { payload })
        return true
    }
}

export default UseItemListener
