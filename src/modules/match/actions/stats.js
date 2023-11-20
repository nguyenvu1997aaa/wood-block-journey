import {
    MATCH_ONLINE_STATS_UPDATE,
    MATCH_STATS_CURRENT_UPDATE,
    MATCH_STATS_DATA_CLEAR,
    MATCH_STATS_DATA_UPDATE,
} from '../constants/ActionTypes'

export const clearMatchDataStats = (playerId) => ({
    type: MATCH_STATS_DATA_CLEAR,
    payload: { playerId },
})

export const updateMatchDataStats = (playerId, stats) => ({
    type: MATCH_STATS_DATA_UPDATE,
    payload: { playerId, stats },
})

export const updateMatchCurrentStats = (stats) => ({
    type: MATCH_STATS_CURRENT_UPDATE,
    payload: { stats },
})

export const updateMatchOnlineStats = (leaders) => ({
    type: MATCH_ONLINE_STATS_UPDATE,
    payload: { leaders },
})
