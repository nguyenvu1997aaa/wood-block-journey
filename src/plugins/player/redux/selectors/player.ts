import { createSelector } from 'reselect'
import { REDUCER_NAME } from '../../constants/ReducerTypes'

const getPlayerState = (state: IState) => state[REDUCER_NAME]
const getPlayerDataState = (state: IState) => state[REDUCER_NAME].data
const getConnectedPlayersState = (state: IState) => state[REDUCER_NAME].connectedPlayers

const getLimitProps = (_: unused, props: TObject) => props.limit
const getOffsetProps = (_: unused, props: TObject) => props.offset

export const getPlayer = createSelector([getPlayerState], (player) => player)
export const getPlayerId = createSelector([getPlayer], (player) => player.playerId)
export const getPlayerASID = createSelector([getPlayer], (player) => player.ASID)

export const getPlayerData = createSelector([getPlayerDataState], (data) => data)
export const getPlayerSettings = createSelector([getPlayerData], (data) => data.settings)

export const getConnectedPlayers = createSelector(
    [getConnectedPlayersState],
    (connectedPlayers) => connectedPlayers
)

export const getConnectedPlayerIds = createSelector(
    [getConnectedPlayers, getLimitProps, getOffsetProps],
    (connectedPlayers, limit, offset) => {
        if (typeof limit !== 'number') return []
        if (typeof offset !== 'number') return []

        const playerIds = Object.keys(connectedPlayers)
        return playerIds.slice(offset, limit + offset) || []
    }
)

export const getPlayerBestScore = createSelector([getPlayerData], (data) => data.score)
export const getPlayerCustomData = createSelector([getPlayerData], (data) => data.customFields)

/* export const getPlayerDiamond = createSelector(
    [getPlayerCustomData],
    (customFields) => customFields?.diamond
)
 */