import { AnalyticsEvents } from '@/constants/Analytics'
import { CHALLENGE_FRIEND_MATCH, SHARE_INVITE } from '@/constants/ContextTypes'
import { SampleOpponent } from '@/constants/SampleOpponent'
import { SceneEvents, SceneKeys } from '@/game/constants/scenes'
import {
    continueChallengeGame,
    startMatchingGroupModeGame,
    startMultiModeGame,
    startSingleModeGame,
    startTournamentGame,
} from '@/modules/match/actions/gameplay'
import { updateMatchDataStats } from '@/modules/match/actions/stats'
import {
    MATCH_MODE_CHALLENGE_FRIENDS,
    MATCH_MODE_MATCHING_GROUP,
    MATCH_MODE_TOURNAMENTS,
} from '@/modules/match/constants/GameModes'
import { activeTournament } from '@/modules/tournament/actions/tournament'
import PlayerDtos from '@/plugins/player/dtos/Player'
import { getContext, getCurrentGameMode } from '@/redux/selectors/context'

export const processContextData = () => (dispatch: IDispatch, getState: IGetSate) => {
    const { player, analytics, globalScene } = window.game

    try {
        const state = getState()
        const context = getContext(state)
        const gameMode = getCurrentGameMode(state)

        const currPlayer = player.getPlayer()
        const { entryPointData } = context
        const { type } = entryPointData || {}

        if (currPlayer.isUserNew) {
            analytics.event(AnalyticsEvents.NEW_USER)
        }

        // Tournament mode
        if (gameMode === MATCH_MODE_TOURNAMENTS) {
            dispatch(processTournamentMode())
            return
        }

        // Challenge friend mode
        if (gameMode === MATCH_MODE_CHALLENGE_FRIENDS) {
            // Challenge friend from a post in timeline
            if (type === SHARE_INVITE) {
                dispatch(processInviteMode())
                return
            }

            // Challenge friend from message
            if (type === CHALLENGE_FRIEND_MATCH) {
                dispatch(processChallengeFriendMode())
                return
            }
        }

        // Matching group mode
        if (gameMode === MATCH_MODE_MATCHING_GROUP) {
            dispatch(processMatchingGroupMode())
            return
        }

        // Process flow for new user
        if (currPlayer.isUserNew) {
            dispatch(processNewUserMode())
            return
        }

        globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.DASHBOARD_SCENE)
    } catch (error) {
        globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.DASHBOARD_SCENE)
        console.warn(error)
    }
}

const getOpponentInfo = (state: IState) => {
    try {
        const context = getContext(state)

        const { player } = window.game
        const { entryPointData } = context
        const { playerId, playerName, playerPhoto } = entryPointData || {}

        const currPlayer = player.getPlayer()
        const isPlayer = currPlayer.playerId === playerId

        // Return default opponent info
        if (isPlayer) return SampleOpponent

        return new PlayerDtos(
            playerId as string,
            playerName as string,
            playerPhoto as string
        ).toObject()
    } catch (error) {
        console.warn(error)
        return SampleOpponent
    }
}

const processTournamentMode = () => (dispatch: IDispatch) => {
    try {
        const { facebook } = window.game

        // Get tournamentID for update leaderboard
        // ? Run background task
        facebook
            .getTournamentAsync()
            .then((tournament) => {
                const tournamentId = tournament.getID().toString()
                dispatch(activeTournament(tournamentId))
            })
            .catch((error) => {
                console.warn(error)
            })

        dispatch(startTournamentGame())
    } catch (error) {
        console.warn(error)
    }
}

const processInviteMode = () => (dispatch: IDispatch, getState: IGetSate) => {
    try {
        const state = getState()
        const context = getContext(state)

        const { player } = window.game

        const currPlayer = player.getPlayer()
        const { contextId, entryPointData } = context
        const { playerId } = entryPointData || {}

        const isCurrentPlayer = currPlayer.playerId === playerId

        const opponentInfo = getOpponentInfo(state)

        if (!isCurrentPlayer) {
            player.updateConnectedPlayers([opponentInfo])
        }

        // ? If this post is owner, it will play with playerId=10 (SampleOpponent)
        const { playerId: opponentId } = opponentInfo
        dispatch(startMultiModeGame(contextId, opponentId, true))
    } catch (error) {
        throw new Error('processInviteMode: ' + error)
    }
}

const processChallengeFriendMode = () => (dispatch: IDispatch, getState: IGetSate) => {
    try {
        const state = getState()
        const context = getContext(state)

        const { player } = window.game

        const currPlayer = player.getPlayer()
        const { entryPointData } = context
        const { matchId, opponentId, playerId } = entryPointData || {}

        const isCurrentPlayer = currPlayer.playerId === playerId

        if (isCurrentPlayer) {
            dispatch(continueChallengeGame(matchId, opponentId))
        } else {
            dispatch(continueChallengeGame(matchId, playerId))
        }
    } catch (error) {
        throw new Error('processChallengeFriendMode: ' + error)
    }
}

const processMatchingGroupMode = () => (dispatch: IDispatch, getState: IGetSate) => {
    try {
        const state = getState()
        const context = getContext(state)

        const { entryPointData } = context
        const { playerId, playerScore } = entryPointData || {}

        const stats = { score: playerScore, level: 0 }
        dispatch(updateMatchDataStats(playerId, stats))

        const opponentInfo = getOpponentInfo(state)

        const groupOpponentInfo = {
            ...opponentInfo,
            score: playerScore,
        }

        dispatch(startMatchingGroupModeGame(groupOpponentInfo))
    } catch (error) {
        throw new Error('processMatchingGroupMode: ' + error)
    }
}

const processNewUserMode = () => (dispatch: IDispatch) => {
    try {
        dispatch(startSingleModeGame())
    } catch (error) {
        throw new Error('processNewUserMode: ' + error)
    }
}
