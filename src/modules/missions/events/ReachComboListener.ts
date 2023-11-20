import Emitter from '@/utils/emitter'
import MISSIONS from '../constants/Missions'
import BaseListener from './BaseListener'

const { EVENTS, TYPES } = MISSIONS

class ReachComboListener extends BaseListener {
    constructor(game: Phaser.Game, name: string) {
        super(game, TYPES.COMBO, name)
    }

    protected initEvents(): void {
        Emitter.off(EVENTS.MISSION_UPDATE, this.process)
        Emitter.on(EVENTS.MISSION_UPDATE, this.process)
    }

    protected processMore(payload: IMissionEventPayload): boolean {
        // console.log('ReachCombo', { payload });

        const mission = this.getMissionData()
        if (!mission) return false

        const { type, value } = payload

        return value >= mission.require[type]
    }
}

export default ReachComboListener
