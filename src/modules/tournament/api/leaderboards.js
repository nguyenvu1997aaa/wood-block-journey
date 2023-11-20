import { get, post } from '@/api/clients/instance'
import { sleepAsync } from '@/utils/DateTime'

const { AppId, OtherHost, LeadersBoard } = GameCore.Configs

export const createLeaderboardAsync = async (data) => {
    const defaultData = {
        appId: AppId,
        resetScore: 0,
        numberOfLeaders: 15,
        timezone: 'utc+0',
        sortOrder: 'desc',
        statistics: 'max',
        resettable: 'manually',
        description: 'no description',
    }

    // * Mockup
    if (LeadersBoard.UseMock) {
        await sleepAsync(1000)
        return {
            ...defaultData,
            ...data,
            _id: LeadersBoard.LeaderboardId,
            type: 'app_leaderboard',
            description: 'mockup_leaderboard',
            createdAt: new Date(Date.now()).toISOString(),
            updatedAt: new Date(Date.now()).toISOString(),
        }
    }

    const url = 'leaderboards'
    const result = await post(url, { ...defaultData, ...data }, {}, OtherHost)

    return result?.data || {}
}

export const getLeaderboardAsync = async (leaderboardId, payload = {}) => {
    let leaders = []

    // * Mockup
    if (LeadersBoard.UseMock) {
        await sleepAsync(1000)

        const { limit = 10, offset = 0 } = payload
        return new Array(limit).fill(null).map((_, index) => {
            const id = (index + 1) * (offset + 1)
            return {
                playerId: `player-0${id}`,
                name: `MPlayer ${id}`,
                photo: './assets/images/others/avatar.jpg',
                rank: id,
                score: Math.floor(100000 / id + Math.random() * 10000),
            }
        })
    }

    const params = GameCore.Utils.String.params(payload)

    const url = `leaderboards/${leaderboardId}/leaders`
    const result = await get(`${url}?${params}`, {}, OtherHost)

    if (!result || result?.error) {
        throw new Error(result?.error || 'Leaderboard not found')
    }

    const data = result?.data || []

    if (data.length < 1) return leaders

    leaders = data

    return leaders
}

export const setScoreAsync = async (leaderboardId, playerId, score) => {
    const result = await post(
        `leaderboards/${leaderboardId}/players/${playerId}`,
        { score },
        {},
        OtherHost
    )

    return result?.data || {}
}
