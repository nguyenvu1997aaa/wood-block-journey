import Emitter from '@/utils/emitter'
import { getDailyTasksAsync } from '../api/tasks'
import {
    DAILY_TASKS_DATA_RECEIVE,
    DAILY_TASKS_DATA_REQUEST,
    DAILY_TASKS_PROCESS_UPDATE,
    DAILY_TASKS_SEEN,
} from '../constants/ActionTypes'
import TASKS from '../constants/Tasks'
import { getDailyTasksProcess, getDailyTasksRequesting } from '../selectors/tasks'

const { DailyTasks } = GameCore.Configs

export const requestDailyTasks = () => async (dispatch: IDispatch, getState: IGetSate) => {
    const state = getState()

    const isRequesting = getDailyTasksRequesting(state)
    if (isRequesting) return

    dispatch({
        type: DAILY_TASKS_DATA_REQUEST,
        payload: {},
    })

    const tasks = await getDailyTasksAsync()

    dispatch(receiveDailyTasks(tasks))
}

export const receiveDailyTasks = (tasks: IMissionData[]) => (dispatch: IDispatch) => {
    dispatch({
        type: DAILY_TASKS_DATA_RECEIVE,
        payload: { tasks },
    })

    const { player } = window.game
    const dailyTasks = player.getCustomData('dailyTasks') as IDailyTasks

    const { startedTime = 0, logTasks = {} } = dailyTasks || {}

    const now = Date.now()
    const isReset = (now - startedTime) / 1000 > DailyTasks.Duration

    if (isReset) {
        dispatch(resetDailyTasks(tasks))
    } else {
        dispatch(updateTasksProcess(logTasks))
    }
}

export const resetDailyTasks =
    (tasks: IMissionData[]) =>
    (dispatch: IDispatch): void => {
        const process: TObject = {}

        tasks.forEach((task) => {
            const { id, require } = task

            process[id] = {}

            Object.keys(require).forEach((type) => {
                process[id] = { [type]: 0, rewarded: false }
            })
        })

        const { player } = window.game

        player.setCustomData('dailyTasks', {
            logTasks: process,
            startedTime: Date.now(),
        })

        dispatch(updateTasksProcess(process as ILogTask))

        Emitter.emit(TASKS.EVENTS.TASKS_RESET)
    }

export const updateTasksProcess = (process: ILogTask) => ({
    type: DAILY_TASKS_PROCESS_UPDATE,
    payload: { process },
})

export const seenTasks = () => (dispatch: IDispatch) => {
    dispatch({
        type: DAILY_TASKS_SEEN,
        payload: {},
    })

    Emitter.emit(TASKS.EVENTS.NOTICE_UPDATE)
}

export const syncTask = () => (_: IDispatch, getState: IGetSate) => {
    const { player } = window.game
    const state = getState()
    const process = getDailyTasksProcess(state)

    player.setCustomData('dailyTasks', { logTasks: process })
}
