import Emitter from '@/utils/emitter'
import BaseListener from './events/BaseListener'
import { requestMissionsData } from './actions/missions'
import MISSIONS from './constants/Missions'
import CollectGemsListener from './events/CollectGemsListener'
import { getMissionsData } from './selectors/missions'
import ReachComboListener from './events/ReachComboListener'
import UseItemListener from './events/UseItemListener'

interface IListener {
    [key: string]: BaseListener
}

class ModuleMissions {
    private game: Phaser.Game
    private listener!: IListener

    constructor(game: Phaser.Game) {
        this.game = game
        this.init()
    }

    private init = async (): Promise<void> => {
        await this.initData()

        this.initListeners()
        this.initEvents()
    }

    private initData = async (): Promise<void> => {
        await this.game.storage.dispatch(requestMissionsData())
    }

    private initListeners(): void {
        this.listener = {}

        const state = this.game.storage.getState()
        const missions = getMissionsData(state)

        if (!missions) return

        Object.keys(missions).forEach((name) => {
            const { id } = missions[name]

            switch (id) {
                case MISSIONS.TYPES.COLLECT_GEMS:
                    this.listener[name] = new CollectGemsListener(this.game, name)
                    break

                case MISSIONS.TYPES.COMBO:
                    this.listener[name] = new ReachComboListener(this.game, name)
                    break

                case MISSIONS.TYPES.USE_ITEM:
                    this.listener[name] = new UseItemListener(this.game, name)
                    break
            }
        })
    }

    private initEvents(): void {
        Emitter.off(MISSIONS.EVENTS.MISSION_START, this.startListener)
        Emitter.on(MISSIONS.EVENTS.MISSION_START, this.startListener)
    }

    private startListener = (name: string): void => {
        if (!this.listener[name]) return

        this.listener[name].start()
    }
}

export default ModuleMissions
