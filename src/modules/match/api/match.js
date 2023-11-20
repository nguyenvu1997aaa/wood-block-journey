import { get, post } from '@/api/clients/instance'

const { ApiHost } = GameCore.Configs

// Single mode
export const createSingleMatchAsync = async (payload) => {
    const url = 'single-matches'
    const result = await post(url, payload, {}, ApiHost)
    return result?.data || {}
}

export const getSingleMatchDetailAsync = async () => {
    const url = 'single-matches/active'
    const result = await get(url, {}, ApiHost)
    return result?.data || {}
}

export const updateSingleMatchMoveAsync = async (matchId, payload) => {
    const url = `single-matches/${matchId}/move`
    const result = await post(url, payload, {}, ApiHost)
    return result?.data || {}
}

export const finishSingleMatchAsync = async (matchId) => {
    const url = `single-matches/${matchId}/finish`
    const result = await post(url, {}, {}, ApiHost)
    return result?.data || {}
}

// Multi mode
export const createMatchAsync = async (opponentPlayerId) => {
    const url = `matches`
    const result = await post(url, { opponentPlayerId }, {}, ApiHost)
    return result?.data || {}
}

export const joinMatchAsync = async (matchId) => {
    const url = `matches/${matchId}/join`
    const result = await post(url, {}, {}, ApiHost)
    return result?.data || {}
}

export const getMatchDetailByIdAsync = async (matchId) => {
    const url = `matches/${matchId}`
    const result = await get(url, {}, ApiHost)
    return result?.data || {}
}

export const finishMatchAsync = async (matchId, score, level, extraData) => {
    const url = `matches/${matchId}/finish`
    const result = await post(url, { matchId, score, level, extraData }, {}, ApiHost)
    return result?.data || {}
}
