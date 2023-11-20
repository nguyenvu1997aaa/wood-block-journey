import { addTaskValue, finishedTask } from '../actions/task'
import { getDailyTasksData, getDailyTasksProcess } from '../selectors/tasks'

abstract class BaseListener {
    public game: Phaser.Game
    protected id: string

    private taskData: IMissionData
    private requireTypes: string[]

    constructor(game: Phaser.Game, id: string) {
        this.game = game
        this.id = id

        this.init()
    }

    public init(): void {
        const state = this.game.storage.getState()
        const tasksData = getDailyTasksData(state) || []

        if (tasksData?.length < 1) return

        const taskData = tasksData?.find((task) => {
            return task.id === this.id
        })

        if (!taskData) return

        this.taskData = taskData
        this.requireTypes = Object.keys(this.taskData.require)

        this.initEvents()
    }

    protected abstract initEvents(): void

    private getDataByType(type: string) {
        const state = this.game.storage.getState()
        const tasksProcess = getDailyTasksProcess(state)

        const data = { value: 0, target: 0 }

        if (!tasksProcess) return data
        if (!GameCore.Utils.Object.hasOwn(tasksProcess, this.taskData.id)) return data

        const taskProcess = tasksProcess[this.taskData.id]

        if (
            GameCore.Utils.Valid.isObject(taskProcess) &&
            GameCore.Utils.Object.hasOwn(taskProcess, type)
        ) {
            const value = taskProcess[type]
            if (typeof value === 'number') {
                data.value = value
            }
        }

        data.target = this.taskData.require[type] || 0

        return data
    }

    protected getCorrectValue(type: string, value: number): number {
        const { value: currentValue, target } = this.getDataByType(type)

        let correctValue = value

        if (currentValue + value > target) {
            correctValue = target - currentValue
        }

        return Math.round(correctValue)
    }

    private isPassRequiredTarget(type: string): boolean {
        const { value, target } = this.getDataByType(type)

        return value >= target
    }

    private isTaskFinished(type: string): boolean {
        const { value, target } = this.getDataByType(type)

        return value >= target
    }

    protected process = (payload: ITaskEventPayload, sendRequest = true): void => {
        let { type, value } = payload

        if (value < 1) return
        if (this.requireTypes.indexOf(type) === -1) return
        if (this.isPassRequiredTarget(type)) return

        const success = this.processMore(payload)

        if (!success) return
        ;({ type, value } = payload)
        const correctValue = this.getCorrectValue(type, value)

        this.game.storage.dispatch(addTaskValue(this.id, type, correctValue, sendRequest))

        if (this.isTaskFinished(type)) {
            this.game.storage.dispatch(finishedTask(this.id))
        }
    }

    protected abstract processMore(payload: ITaskEventPayload): boolean
}

export default BaseListener
