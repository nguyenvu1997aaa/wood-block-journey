import { sleepAsync } from '@/utils/DateTime'
import { sendException } from '@/utils/Sentry'
import { getConnectedPlayerEntriesAsync, getLeaderboardAsync } from '../api/leaderboards'
import {
    LEADERBOARD_DATA_CLEAR,
    LEADERBOARD_DATA_REQUEST,
    LEADERBOARD_DATA_UPDATE,
} from '../constants/ActionTypes'
import { LEADERBOARD_TYPE_FRIEND, LEADERBOARD_TYPE_GLOBAL } from '../constants/LeaderboardsTypes'

const { UseMock, Limit } = GameCore.Configs.LeadersBoard

// Actions
export const requestLeaderboardData =
    (leaderboardId, type, limit = Limit, offset = 0) =>
    async (dispatch) => {
        try {
            const { player } = window.game

            const currentPlayerId = player.getPlayerId()

            dispatch(clearLeaderboardData())

            dispatch({
                type: LEADERBOARD_DATA_REQUEST,
                payload: { leaderboardId, type, limit, offset },
            })

            if (UseMock) {
                // * Start Mockup
                await sleepAsync(1000)
                // const playerPhoto = getPlayerPhoto(state);
                // const playerIndex = Math.floor(Math.random() * (limit - 1))
                // const playerIndex = 45
                const playerIndex = 145

                const mockLeaders = new Array(limit).fill(null).map((_, index) => {
                    const id = (index + 1) * (offset + 1)
                    return {
                        playerId: index === playerIndex ? currentPlayerId : `0${id}`,
                        name: index === playerIndex ? 'Current Player' : `MPlayer ${id}`,
                        photo: './assets/images/others/avatar.png',
                        rank: id,
                        score: Math.floor(100000 / id),
                    }
                })

                dispatch(updateLeaderboardData(mockLeaders, type))
                return
                // * End Mockup
            }

            let entries = []

            if (type === LEADERBOARD_TYPE_GLOBAL) {
                entries = await getLeaderboardAsync({ limit, offset })
            } else if (type === LEADERBOARD_TYPE_FRIEND) {
                const playerIds = player.getConnectedPlayerIds(limit, offset)

                playerIds.push(currentPlayerId)

                const correctPlayerIds = GameCore.Utils.Array.unique(playerIds)

                entries = await getConnectedPlayerEntriesAsync({
                    playerIds: correctPlayerIds,
                    limit: correctPlayerIds.length,
                })

                correctPlayerIds.forEach((id) => {
                    const filter = entries.filter((i) => {
                        return i.playerId === id
                    })

                    if (!filter || filter.length === 0) {
                        entries.push({ playerId: id, score: 0 })
                    }
                })
            }

            const leaders = {}

            for (const leader of entries) {
                const { playerId, score, rank } = leader

                const player = leader.getPlayer()
                const photo = player.getPhoto()
                const name = player.getName()

                leaders[playerId] = { playerId, name, photo, score, rank }
            }

            // state = getState()
            // const leaderboardLeaders = getLeaderboardLeaders(state)

            // if (!leaders[currentPlayerId] && !leaderboardLeaders[currentPlayerId]) {
            //     const playerEntry = await getPlayerEntryAsync(currentPlayerId)

            //     if (playerEntry) {
            //         const { playerId, score, rank } = playerEntry
            //         const { name, photo } = player.getPlayer()
            //         leaders[playerId] = { playerId, name, photo, score, rank }
            //     }
            // }

            console.log('Request leaderboard data', leaders)

            dispatch(updateLeaderboardData(leaders, type))
        } catch (error) {
            dispatch(updateLeaderboardData([], type))
            sendException(error)
        }
    }

export const updateLeaderboardData = (leaders, type) => ({
    type: LEADERBOARD_DATA_UPDATE,
    payload: { leaders, type },
})

export const clearLeaderboardData = () => ({
    type: LEADERBOARD_DATA_CLEAR,
    payload: {},
})
