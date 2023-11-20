import { AnalyticsEvents } from '@/constants/Analytics'
import { TOURNAMENT } from '@/constants/ContextTypes'
import { startTournamentGame } from '@/modules/match/actions/gameplay'
import { MATCH_MODE_SINGLE, MATCH_MODE_TOURNAMENTS } from '@/modules/match/constants/GameModes'
import { getGameplayMode } from '@/modules/match/selectors/gameplay'
import { sendException } from '@/utils/Sentry'
import { createLeaderboardAsync, setScoreAsync } from '../api/leaderboards'
import {
    TOURNAMENT_ACTIVE,
    TOURNAMENT_RECEIVED,
    TOURNAMENT_REQUEST,
} from '../constants/ActionTypes'
import CurrentTournamentScoreIsNotBest from '../exceptions/CurrentTournamentScoreIsNotBest'

const { UseLeaderboard } = GameCore.Configs.Tournament
// Validate
// ? Temporary disabled
/* const validateTournamentScore = (payload) => {
    const { score, bestSessionScore } = payload

    if (score <= bestSessionScore) {
        // TODO: enable if only post when new score best then latest score
        throw new CurrentTournamentScoreIsNotBest(null, { score, bestSessionScore })
    }
} */

export const activeTournament = (tournamentId) => ({
    type: TOURNAMENT_ACTIVE,
    payload: { tournamentId },
})

export const createTournament = (payload) => async (dispatch) => {
    try {
        const { facebook } = window.game
        const { playerId, playerName, score, autoStartGame } = payload

        // * Check this player has a tournament session
        // ? Temporary disabled
        /* const tournaments = await facebook.tournament.getTournamentsAsync()
        const foundTournament = tournaments.find((tournament) => {
            const payload = JSON.parse(tournament.getPayload() || '{}')
            return payload.playerId === playerId
        })

        if (foundTournament) {
            postSessionScoreTournament(payload)
            return
        } */

        const tournamentTitle = `${playerName}'s Tournament`
        const leaderboardId = GameCore.Utils.String.generateObjectId()

        // Create new tournament session and share
        const tournament = await facebook.tournament.createAsync({
            initialScore: score,
            config: {
                title: tournamentTitle,
                // * testing title and tournamentTitle
                tournamentTitle: tournamentTitle,
            },
            data: { playerId, playerName, leaderboardId },
        })

        const tournamentId = tournament.getID()

        // * Start tournament mode after create tournament session
        if (autoStartGame) {
            dispatch(activeTournament(tournamentId))
            dispatch(startTournamentGame())
        }

        // Create new leaderboard for this tournament
        const result = await createLeaderboardAsync({
            _id: leaderboardId,
            createdBy: playerId,
            name: tournamentId,
            description: tournamentTitle,
            // Expire in 7 day
            expireTime: 7 * 24 * 60 * 60 * 1000,
        })

        if (result._id === leaderboardId) {
            await setScoreAsync(leaderboardId, playerId, score)
        }
    } catch (error) {
        sendException(error)
    }
}

// Update score and share for exist tournament session
const shareTournament = (payload) => async () => {
    const { facebook } = window.game
    const { playerId, playerName, leaderboardId, score } = payload

    if (leaderboardId) {
        setScoreAsync(leaderboardId, playerId, score)
    }

    await facebook.tournament.shareAsync({
        score,
        data: {
            type: TOURNAMENT,
            playerId,
            playerName,
        },
    })

    setScoreAsync(leaderboardId, playerId, score)
}

// Update score and share on a solo or any context session
// ? Temporary disabled
/* const postSessionScoreTournament = async (payload) => {
    const { facebook } = window.game
    const { score } = payload

    await facebook.tournament.postSessionScoreAsync(score)
} */

const getLeaderboardIdFromCurrentTournament = async () => {
    try {
        const { facebook } = window.game
        const tournament = await facebook.getTournamentAsync()
        const payload = JSON.parse(tournament.getPayload() || '{}')

        return payload.leaderboardId
    } catch (error) {
        // sendException(error)
        return null
    }
}

const getCurrentTournament = async () => {
    try {
        const { facebook } = window.game
        return await facebook.getTournamentAsync()
    } catch (error) {
        console.warn('getCurrentTournament ~ error', error)
        return null
    }
}

export const requestTournament = (score) => async (dispatch, getState) => {
    let activeEvent = null

    const { player, facebook, analytics } = window.game

    try {
        const state = getState()

        const gameMode = getGameplayMode(state)

        if (![MATCH_MODE_SINGLE, MATCH_MODE_TOURNAMENTS].includes(gameMode)) return

        dispatch({
            type: TOURNAMENT_REQUEST,
            payload: {},
        })
        const { playerId, name: playerName } = player.getPlayer()

        const tournament = await getCurrentTournament()

        if (tournament) {
            activeEvent = AnalyticsEvents.TOURNAMENT_SHARE

            // const bestSessionScore = getTournamentBestSessionScore(state)
            // validateTournamentScore({ score, bestSessionScore })

            // ? Feature tournament with leaderboard in Game
            if (UseLeaderboard) {
                const leaderboardId = await getLeaderboardIdFromCurrentTournament()

                const payload = { playerId, playerName, score, leaderboardId }
                await dispatch(shareTournament(payload))
            }
        } else {
            activeEvent = AnalyticsEvents.TOURNAMENT_CREATE

            // ? Feature tournament with leaderboard in Game
            if (UseLeaderboard) {
                const payload = { playerId, playerName, score, autoStartGame: false }
                await dispatch(createTournament(payload))
            }
        }

        analytics.event(activeEvent, { success: true })

        if (UseLeaderboard === false) {
            await facebook.requestTournamentAsync(score)
        }

        dispatch(receiveTournament(score))
    } catch (error) {
        if (error instanceof CurrentTournamentScoreIsNotBest) return

        activeEvent && analytics.event(activeEvent, { success: false })

        // sendException(error)
    }
}

export const receiveTournament = (score) => ({
    type: TOURNAMENT_RECEIVED,
    payload: { score },
})
