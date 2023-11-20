import Emitter from '@/utils/emitter'
import { finishMission, updateMission } from '../actions/mission'
import MISSIONS from '../constants/Missions'
import { getCurrentMission } from '../selectors/mission'

abstract class BaseListener {
    public game: Phaser.Game

    protected id: string
    protected name: string
    protected reward: number

    constructor(game: Phaser.Game, id: string, name: string) {
        this.id = id
        this.name = name
        this.game = game
    }

    public start(): void {
        const state = this.game.storage.getState()
        const mission = getCurrentMission(state)

        if (!mission) return
        if (mission.name !== this.name) return

        this.reward = mission.reward

        this.initEvents()
    }

    protected abstract initEvents(): void

    protected getMissionData(): IMissionProcess | null {
        const state = this.game.storage.getState()
        const mission = getCurrentMission(state)

        if (!mission) return null
        if (mission.name !== this.name) return null

        return mission
    }

    private getDataByType(type: string) {
        const mission = this.getMissionData()

        if (!mission) return null

        const target = mission.require[type]
        const value = mission.process[type]

        return { value, target }
    }

    private isTypeRequired(type: string): boolean {
        const data = this.getDataByType(type)
        if (!data) return false

        return data.target > 0
    }

    private isMissionComplete(): boolean {
        const mission = this.getMissionData()
        if (!mission) return true

        const { require, process } = mission

        let isComplete = true

        Object.keys(require).forEach((key) => {
            if (!isComplete) return

            const need = require[key]
            const have = process[key]

            if (have < need) {
                isComplete = false
            }
        })

        return isComplete
    }

    protected process = (payload: IMissionEventPayload): void => {
        const { id, type, value } = payload

        if (value < 1) return
        if (this.id !== id) return

        if (!this.isTypeRequired(type)) return

        const success = this.processMore(payload)
        if (!success) return

        this.game.storage.dispatch(updateMission(this.name, type, value))

        if (this.isMissionComplete()) {
            Emitter.emit(MISSIONS.EVENTS.MISSION_COMPLETED, {
                name: this.name,
                reward: this.reward,
            })

            this.game.storage.dispatch(finishMission(this.name))
        }
    }

    protected abstract processMore(payload: IMissionEventPayload): boolean
}

export default BaseListener
