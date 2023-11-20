import { getDailyRewardsAsync } from '../api/rewards'
import { DAILY_REWARDS_RECEIVE, DAILY_REWARDS_REQUEST } from '../constants/ActionTypes'
import DAY_STATUS from '../constants/Status'
import { getDailyRewardsRequesting } from '../selectors/rewards'

const { DailyRewards } = GameCore.Configs

export const requestDailyRewards = () => async (dispatch: IDispatch, getState: IGetSate) => {
    const state = getState()

    const isRequesting = getDailyRewardsRequesting(state)
    if (isRequesting) return

    dispatch({
        type: DAILY_REWARDS_REQUEST,
        payload: {},
    })

    const rewardsData = await getDailyRewardsAsync()

    dispatch(receiveDailyRewards(rewardsData))
}

export const receiveDailyRewards = (rewardsData: IRewardPayload[]) => (dispatch: IDispatch) => {
    const { player } = window.game

    const dailyRewarded = player.getCustomData('dailyRewarded') as IDailyRewarded

    const { logDays = [], lastRewarded = 0 } = dailyRewarded || {}

    const now = new Date()
    const dateTimeRewarded = new Date(lastRewarded)
    const dayRewarded = new Date(dateTimeRewarded.toDateString())
    const diffTime = Math.abs(now.valueOf() - dayRewarded.valueOf())
    const diffDays = Math.floor(diffTime / 86400000)
    const isOverOneDay = diffDays > 1
    const isInterrupted = DailyRewards.CheckInterrupt && isOverOneDay
    const isReset = isInterrupted || logDays.length >= DailyRewards.MaxDays

    const correctLogDays = isReset ? [false] : [...logDays, false]

    // Default is set not receive reward, after claim this it will update again
    logDailyReward(correctLogDays)

    // Update status of rewards
    const rewards = rewardsData.map((data, index) => {
        const isLogged = index < correctLogDays.length
        const isToday = correctLogDays.length === index + 1
        const isInterrupted = correctLogDays[index] === false

        let status = DAY_STATUS.WAITING

        if (isToday) {
            status = DAY_STATUS.READY
        } else if (isReset) {
            status = DAY_STATUS.WAITING
        } else if (isLogged && isInterrupted) {
            status = DAY_STATUS.SKIPPED
        } else if (isLogged) {
            status = DAY_STATUS.REWARDED
        }

        // console.log({ index, status, isToday, isLogged, isInterrupted });

        return { ...data, status }
    })

    dispatch({
        type: DAILY_REWARDS_RECEIVE,
        payload: { rewards },
    })
}

export const logDailyReward = (logs: boolean[], isReset = false) => {
    const { player } = window.game

    player.setCustomData('dailyRewarded', {
        logDays: logs,
        lastRewarded: isReset ? 0 : Date.now(),
    })
}
