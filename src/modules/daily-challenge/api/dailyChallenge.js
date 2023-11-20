import { get, post } from '@/api/clients/instance'

const { OtherHost, DailyChallenge } = GameCore.Configs

export const setTimeAsync = async (playerId, time) => {
    const result = await post(
        `leaderboards/${DailyChallenge.LeaderBoardId}/players/${playerId}`,
        { score: time },
        {},
        OtherHost
    )
    return result?.data || {}
}

export const getDailyChallengeLeadersEntriesAsync = async (limit, offset) => {
    let leaders = []

    const url = `${DailyChallenge.Prefix}/${DailyChallenge.LeaderBoardId}/leaders`

    if (!url) return leaders

    const result = await get(`${url}?limit=${limit}&offset=${offset}`, {}, OtherHost)

    const data = result?.data || []

    if (data.length < 1) return leaders

    leaders = data

    return leaders
}
