import produce from 'immer'
import { AnyAction } from 'redux'

import {
    DAILY_TASKS_DATA_RECEIVE,
    DAILY_TASKS_DATA_REQUEST,
    DAILY_TASKS_PROCESS_UPDATE,
    DAILY_TASKS_SEEN,
    DAILY_TASK_FINISHED,
    DAILY_TASK_REWARDED,
    DAILY_TASK_VALUE_ADD,
} from '../constants/ActionTypes'

const initState: IDailyTasksState = {
    tasks: [],
    process: [],
    isRequesting: false,
    isNotice: false,
}

export default (state = initState, action: AnyAction) =>
    produce(state, (draft) => {
        const { payload } = action
        if (!payload) return

        const { id, type, value, tasks, process } = payload

        switch (action.type) {
            case DAILY_TASKS_DATA_REQUEST:
                draft.isRequesting = true
                break

            case DAILY_TASKS_DATA_RECEIVE:
                draft.isRequesting = false
                draft.tasks = tasks
                break

            case DAILY_TASKS_PROCESS_UPDATE:
                // if (!process?.length) break
                draft.process = process
                break

            case DAILY_TASK_VALUE_ADD:
                if (!state.process[id]) break
                draft.process[id][type] += value
                break

            case DAILY_TASK_REWARDED:
                if (!state.process[id]) break
                draft.process[id].rewarded = true
                break

            case DAILY_TASKS_SEEN:
                draft.isNotice = false
                break

            case DAILY_TASK_FINISHED:
                draft.isNotice = true
                break

            default:
        }
    })
