import { createSelector } from 'reselect'
import { REDUCER_NAME } from '../constants/ReducerTypes'

const getDailyTasksDataState = (state: IState) => state[REDUCER_NAME]?.tasks
const getDailyTasksProcessState = (state: IState) => state[REDUCER_NAME]?.process
const getDailyTasksRequestingState = (state: IState) => state[REDUCER_NAME]?.isRequesting
const getDailyTasksNoticeState = (state: IState) => state[REDUCER_NAME]?.isNotice

export const getDailyTasksData = createSelector([getDailyTasksDataState], (tasks) => tasks)

export const getDailyTasksProcess = createSelector(
    [getDailyTasksProcessState],
    (process) => process
)

export const getDailyTasksRequesting = createSelector(
    [getDailyTasksRequestingState],
    (isRequesting) => isRequesting
)

export const getDailyTasksNotice = createSelector(
    [getDailyTasksNoticeState],
    (isNotice) => isNotice
)
