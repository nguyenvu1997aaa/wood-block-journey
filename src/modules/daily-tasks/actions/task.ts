import Emitter from '@/utils/emitter'
import {
    DAILY_TASK_FINISHED,
    DAILY_TASK_REWARDED,
    DAILY_TASK_VALUE_ADD,
} from '../constants/ActionTypes'
import TASKS from '../constants/Tasks'

const getLogTasks = () => {
    const { player } = window.game

    const dailyTasks = player.getCustomData('dailyTasks') as IDailyTasks
    const { logTasks } = dailyTasks || {}

    return GameCore.Utils.Json.clone(logTasks)
}

export const addTaskValue =
    (id: string, type: string, value: number, sendRequest = true) =>
    (dispatch: IDispatch) => {
        const logTasks = getLogTasks()

        if (!GameCore.Utils.Valid.isObject(logTasks)) return

        const log = logTasks as ILogTask
        if (!GameCore.Utils.Object.hasOwn(log, id)) return

        if (log[id].rewarded) return

        if (sendRequest) {
            log[id][type] += value

            const { player } = window.game
            player.setCustomData('dailyTasks', { logTasks: log })
        }

        dispatch({
            type: DAILY_TASK_VALUE_ADD,
            payload: { id, type, value },
        })
    }

export const setTaskRewarded = (id: string) => (dispatch: IDispatch) => {
    const logTasks = getLogTasks()

    if (!GameCore.Utils.Valid.isObject(logTasks)) return

    const log = logTasks as ILogTask
    if (!GameCore.Utils.Object.hasOwn(log, id)) return

    log[id].rewarded = true

    const { player } = window.game
    player.setCustomData('dailyTasks', { logTasks: log })

    dispatch({
        type: DAILY_TASK_REWARDED,
        payload: { id },
    })
}

export const finishedTask = (id: string) => (dispatch: IDispatch) => {
    dispatch({
        type: DAILY_TASK_FINISHED,
        payload: { id },
    })

    Emitter.emit(TASKS.EVENTS.NOTICE_UPDATE)
}
