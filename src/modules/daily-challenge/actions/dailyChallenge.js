import {
    getDailyChallengeLeadersEntriesAsync,
    setTimeAsync,
} from '@/modules/daily-challenge/api/dailyChallenge'
import { sleepAsync } from '@/utils/DateTime'
import { sendException } from '@/utils/Sentry'
import {
    DAILY_CHALLENGE_REQUEST,
    DAILY_CHALLENGE_TIME_PLAY_UPDATE,
    DAILY_CHALLENGE_UPDATE,
} from '../constants/ActionTypes'

// Actions
export const requestMyScoreChallengeData = (payload) => async (dispatch) => {
    try {
        const { time, limit, offset } = payload
        const { player } = window.game
        const currentPlayerId = player.getPlayerId()

        dispatch({
            type: DAILY_CHALLENGE_REQUEST,
            payload: {},
        })

        dispatch(updateLeaderDailyChallengeTimePlay(time))

        await setTimeAsync(currentPlayerId, time)

        await sleepAsync(500)

        dispatch(requestLeaderDailyChallengeData({ limit, offset }))
    } catch (error) {
        sendException(error)
    }
}

export const requestLeaderDailyChallengeData = (payload) => async (dispatch) => {
    try {
        dispatch({
            type: DAILY_CHALLENGE_REQUEST,
            payload: {},
        })

        const { limit, offset } = payload
        const { player, profile } = window.game
        const currentPlayerId = player.getPlayerId()
        const playerIds = player.getConnectedPlayerIds(5, 0)

        playerIds.push(currentPlayerId)

        const entries = await getDailyChallengeLeadersEntriesAsync(limit, offset)

        const leaderIds = entries.map((leader) => leader.playerId)

        leaderIds.push(player.getPlayerId())

        await profile.requestProfiles(leaderIds)

        const profiles = profile.getProfiles()

        const leaders = {}

        for (const leader of entries) {
            const { playerId, score, rank } = leader

            if (!profiles[playerId]) continue

            const { name, photo } = profiles[playerId]

            leaders[playerId] = { playerId, name, photo, score, rank }
        }

        dispatch(updateLeaderDailyChallengeData(leaders))
    } catch (error) {
        dispatch(updateLeaderDailyChallengeData([]))
        sendException(error)
    }
}

export const updateLeaderDailyChallengeData = (leaders) => ({
    type: DAILY_CHALLENGE_UPDATE,
    payload: { leaders },
})

export const updateLeaderDailyChallengeTimePlay = (time) => ({
    type: DAILY_CHALLENGE_TIME_PLAY_UPDATE,
    payload: { time },
})
