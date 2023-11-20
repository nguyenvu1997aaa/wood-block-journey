import { get, post } from '@/api/clients/instance'
import { LEADERBOARD_TYPE_FRIEND, LEADERBOARD_TYPE_GLOBAL } from '../constants/LeaderboardsTypes'

const { ApiHost, OtherHost, LeadersBoard } = GameCore.Configs
const { Prefix, LeaderboardId, Name } = LeadersBoard

const apiGlobal = `${Prefix}/${LeaderboardId}/leaders`
const apiFriends = `${Prefix}/${LeaderboardId}/players`

const getApiByType = (type) => {
    let url = ''
    if (!LeaderboardId) return url

    if (type === LEADERBOARD_TYPE_GLOBAL) {
        url = apiGlobal
    } else if (type === LEADERBOARD_TYPE_FRIEND) {
        url = apiFriends
    }

    return url
}

const mapLeaderEntryAsync = async (leaders) => {
    const listIds = leaders.map((l) => l.playerId)
    const leaderById = GameCore.Utils.Object.keyBy(leaders, 'playerId')
    const params = GameCore.Utils.String.params({ playerIds: listIds })

    const result = await get(`players?${params}`, {}, ApiHost)
    const correctResult = result.data.map((r) => {
        const leader = leaderById[r.playerId]
        return {
            ...r,
            score: leader.score,
            rank: leader.rank,
            getScore: () => leader.score,
            getFormattedScore: () => '',
            getTimestamp: () => new Date().valueOf(),
            getRank: () => leader.rank,
            getExtraData: () => leader.extraData,
            getPlayer: () => ({
                getName: () => r.name,
                getPhoto: () => r.photo,
                getID: () => r.playerId,
            }),
        }
    })
    return correctResult
}

export const getLeaderboardAsync = async (payload = {}) => {
    if (LeaderboardId != null) {
        return getLeaderboardByAPIAsync(payload)
    }
    return getLeaderboardByGameSDKAsync(payload)
}

const getLeaderboardByAPIAsync = async (payload = {}) => {
    let leaders = []

    const url = getApiByType(LEADERBOARD_TYPE_GLOBAL)
    if (!url) return leaders

    const params = GameCore.Utils.String.params(payload)

    const result = await get(`${url}?${params}`, {}, OtherHost)

    const data = result?.data || []

    if (data.length < 1) return leaders

    leaders = data

    return mapLeaderEntryAsync(leaders)
}

const getLeaderboardByGameSDKAsync = async (payload = {}) => {
    const { limit, offset } = payload
    const lb = await window.GameSDK.getLeaderboardAsync(Name)
    const leaders = await lb.getEntriesAsync(limit, offset)

    return leaders
}

export const getConnectedPlayerEntriesAsync = async (payload = {}) => {
    if (LeaderboardId != null) {
        return getConnectedPlayerEntriesByAPIAsync(payload)
    }
    return getConnectedPlayerEntriesByGameSDKAsync(payload)
}

const getConnectedPlayerEntriesByAPIAsync = async (payload = {}) => {
    let leaders = []

    const url = getApiByType(LEADERBOARD_TYPE_FRIEND)
    if (!url) return leaders

    const params = GameCore.Utils.String.params(payload)

    const result = await get(`${url}?${params}`, {}, OtherHost)

    const data = result?.data || []

    if (data.length < 1) return leaders

    leaders = data

    return mapLeaderEntryAsync(leaders)
}

const getConnectedPlayerEntriesByGameSDKAsync = async (payload = {}) => {
    const { limit, offset } = payload
    const lb = await window.GameSDK.getLeaderboardAsync(Name)
    const leaders = await lb.getConnectedPlayerEntriesAsync(limit, offset)

    return leaders
}

export const getPlayerEntryAsync = async (playerId) => {
    if (LeaderboardId != null) {
        return getPlayerEntryByAPIAsync(playerId)
    }
    return getPlayerEntryByGameSDKAsync()
}

const getPlayerEntryByAPIAsync = async (playerId) => {
    let playerEntry = null

    if (!playerId) return playerEntry

    const url = getApiByType(LEADERBOARD_TYPE_FRIEND)
    if (!url) return playerEntry

    const params = GameCore.Utils.String.params({ playerIds: playerId })
    const result = await get(`${url}?${params}`, {}, OtherHost)

    const data = result?.data || []

    if (data.length < 1) return playerEntry

    playerEntry = (await mapLeaderEntryAsync(data))[0]

    return playerEntry
}

const getPlayerEntryByGameSDKAsync = async () => {
    const lb = await window.GameSDK.getLeaderboardAsync(Name)
    const playerEntry = await lb.getPlayerEntryAsync()

    return playerEntry
}

export const setScoreAsync = async (playerId, score) => {
    window.GameSDK.submitGameResultsAsync(score)

    if (LeaderboardId != null) {
        if (window.game.auth.getToken() === '') return Promise.reject('Not logged in')
        return setScoreByAPIAsync(playerId, score)
    }
    return setScoreByGameSDKAsync(score)
}

export const setScoreByAPIAsync = async (playerId, score) => {
    const result = await post(
        `leaderboards/${LeaderboardId}/players/${playerId}`,
        { score },
        {},
        OtherHost
    )

    return result?.data || {}
}

const setScoreByGameSDKAsync = async (score) => {
    const lb = await window.GameSDK.getLeaderboardAsync(Name)
    return await lb.setScoreAsync(score)
}
