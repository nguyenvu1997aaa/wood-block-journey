import { AnalyticsEvents } from '@/constants/Analytics'
import { SampleOpponent } from '@/constants/SampleOpponent'
import InvalidContextId from '@/exceptions/InvalidContextId'
import { SceneEvents, SceneKeys } from '@/game/constants/scenes'
import { ScreenKeys } from '@/game/constants/screens'
import GAME_EVENT from '@/game/gameplay/events/game'
import { setScoreAsync } from '@/modules/leader-boards/api/leaderboards'
import NewScoreIsBad from '@/modules/leader-boards/exceptions/NewScoreIsBad'
import { requestTournament } from '@/modules/tournament/actions/tournament'
import { contextProcessed, gameModeDetected } from '@/redux/actions/context'
import {
    sendBestScoreMessage,
    sendFinishMessage,
    sendGroupMessage,
    sendInviteMessage,
    sendPlayMatchMessage,
} from '@/redux/actions/messages'
import { getMessagesSentStatus } from '@/redux/selectors/messages'
import Emitter from '@/utils/emitter'
import { writeByKeyLocalStorage } from '@/utils/localStorage'
import { addBreadcrumbSentry, sendException } from '@/utils/Sentry'
import {
    MATCH_GAMEPLAY_FINISH,
    MATCH_GAMEPLAY_INITIALIZE,
    MATCH_GAMEPLAY_RESCUE,
    MATCH_GAMEPLAY_RESET_RESCUE,
    MATCH_GAMEPLAY_SHOW_MINI_JOURNEY,
    MATCH_GAMEPLAY_START,
    MATCH_GAMEPLAY_UPDATE,
} from '../constants/ActionTypes'
import {
    MATCH_MODE_CHALLENGE_FRIENDS,
    MATCH_MODE_JOURNEY,
    MATCH_MODE_MATCHING_GROUP,
    MATCH_MODE_ONLINE,
    MATCH_MODE_SINGLE,
    MATCH_MODE_TOURNAMENTS,
} from '../constants/GameModes'
import { MATCH_STATUS_OPEN } from '../constants/MatchStatus'
import InvalidMatchId from '../exceptions/InvalidMatchId'
import { getGameplayFinishAt, getGameplayMode, getGameplayStartAt } from '../selectors/gameplay'
import {
    getChallengeMatchData,
    getChallengeMatchId,
    getChallengeMatchOpponentInfo,
    getChallengeMatchPlayerId,
    getChallengeMatchStatus,
    getIsPlayerFinishChallengeMatch,
    getJourneyMatchId,
    getJourneyMatchLevel,
    getSingleMatchData,
    getSingleMatchId,
    getSingleMatchScore,
} from '../selectors/match'
import { getGameplayCurrentStats, getGameplayStats } from '../selectors/stats'
import {
    cleanOnlineMatch,
    clearChallengeMatchData,
    clearSingleMatchData,
    continueChallengeMatch,
    createChallengeMatch,
    createGroupMatch,
    createJourneyMatch,
    createOnlineMatch,
    createSingleMatch,
    finishChallengeMatch,
    finishGroupMatch,
    finishSingleMatch,
    getSingleMatchDetail,
    joinChallengeMatch,
} from './match'
import { clearMatchDataStats, updateMatchCurrentStats, updateMatchDataStats } from './stats'

const { Match } = GameCore.Configs

export let listPlayerIds = []

// Validator
const validateContextId = (payload) => {
    const { contextId } = payload

    if (contextId === '' || typeof contextId !== 'string') {
        throw new InvalidContextId(null, { contextId })
    }
}

let loadingTimer = null
const closeLoadingScreen = (delay) => {
    clearTimeout(loadingTimer)
    loadingTimer = setTimeout(() => {
        window.game.globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }, delay)
}

export const initializeGameplay = () => ({
    type: MATCH_GAMEPLAY_INITIALIZE,
    payload: {},
})

export const showMiniJourney = (stateShowMiniJourney) => ({
    type: MATCH_GAMEPLAY_SHOW_MINI_JOURNEY,
    payload: {
        stateShowMiniJourney,
    },
})

export const startTournamentGame = () => (dispatch) => {
    try {
        dispatch(clearSingleMatchData())

        dispatch(startGame(MATCH_MODE_TOURNAMENTS))
    } catch (error) {
        sendException(error)
    }
}

export const startSingleModeGame = () => (dispatch) => {
    try {
        dispatch(clearSingleMatchData())

        dispatch(startGame(MATCH_MODE_SINGLE))
    } catch (error) {
        sendException(error)
    }
}

export const startJourneyModeGame = () => (dispatch) => {
    try {
        // dispatch(clearJourneyMatchData())

        dispatch(startJourneyMode())
    } catch (error) {
        sendException(error)
    }
}

export const selectJourneyLevel = () => (dispatch) => {
    try {
        // dispatch(clearJourneyMatchData())

        dispatch(startJourneyMode())
    } catch (error) {
        sendException(error)
    }
}

export const replayGame = () => async (dispatch, getState) => {
    try {
        const { globalScene, lang } = window.game
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        const state = getState()
        const mode = getGameplayMode(state)

        if ([MATCH_MODE_SINGLE, MATCH_MODE_TOURNAMENTS].includes(mode)) {
            dispatch(clearSingleMatchData())
            dispatch(createSingleMatch())
        }

        let opponentInfo = null
        if (mode === MATCH_MODE_CHALLENGE_FRIENDS) {
            opponentInfo = getChallengeMatchOpponentInfo(state)
            dispatch(clearChallengeMatchData())
        }

        dispatch(clearMatchDataStats())

        await dispatch(startGame(mode, opponentInfo))
    } catch (error) {
        sendException(error)
    } finally {
        closeLoadingScreen(300)
    }
}

export const challengeFriend =
    (opponentId = '10', backToDashboard = false) =>
    (dispatch) => {
        try {
            dispatch(startMultiModeGame('reset', opponentId, backToDashboard))
        } catch (error) {
            sendException(error)
        }
    }

export const challengeRandomFriend = () => (dispatch) => {
    try {
        const { player } = window.game
        const connectedPlayerIds = player.getConnectedPlayerIds(99, 0)

        // eslint-disable-next-line no-undef
        const randIndex = Phaser.Math.RND.between(0, connectedPlayerIds.length - 1)

        const opponentId = connectedPlayerIds[randIndex]

        dispatch(challengeFriend(opponentId))
    } catch (error) {
        sendException(error)
    }
}

export const startMultiModeGame =
    (currentContextId, opponentId = '10', backToDashboard = false) =>
    async (dispatch) => {
        try {
            const { player, facebook, globalScene, lang } = window.game

            globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
                message: lang.Text.LOADING,
                loading: true,
            })

            let contextId = currentContextId
            let contextType = facebook.contextType

            if (!opponentId) {
                const id1 = GameCore.Configs.PlayerIdMock
                const id2 = GameCore.Configs.PlayerIdMock2
                opponentId = player.getPlayerId() === id1 ? id2 : id1
            }

            if (!currentContextId) {
                contextId = await facebook.chooseAsync()

                // User canceled
                if (contextId === false) {
                    if (backToDashboard) {
                        globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.DASHBOARD_SCENE)
                    }
                    return
                }
            } else {
                if (opponentId && opponentId !== SampleOpponent.playerId) {
                    contextId = await facebook.createAsync(opponentId)

                    // User cancel
                    if (contextId === false) {
                        if (backToDashboard) {
                            globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.DASHBOARD_SCENE)
                        }
                        return
                    }

                    if (!contextId && currentContextId !== 'reset') contextId = currentContextId
                }

                contextType = facebook.contextType
                dispatch(contextProcessed(contextId, contextType))
            }

            validateContextId({ contextId })

            const currentPlayerId = player.getPlayerId()
            const connectedPlayers = player.getConnectedPlayers()

            const players = await facebook.getContextPlayers(currentPlayerId)

            // Default opponent
            let opponent = SampleOpponent

            // Opponent from entry data is a friend
            if (opponentId !== opponent.playerId && connectedPlayers[opponentId]) {
                opponent = connectedPlayers[opponentId]
            }

            // If only have 1 friend in context
            else if (players.length === 1) {
                opponent = players[0]
            }

            // dispatch(clearChallengeMatchData());

            dispatch(clearMatchDataStats())

            const { playerId, name, photo } = opponent
            const opponentInfo = { playerId, name, photo }

            await dispatch(startGame(MATCH_MODE_CHALLENGE_FRIENDS, opponentInfo))

            dispatch(contextProcessed(contextId, contextType))

            Emitter.emit(GAME_EVENT.START_GAME)
        } catch (error) {
            if (error instanceof InvalidContextId) return

            if (error?.code === 'USER_INPUT') return
            if (error?.code === 'INVALID_OPERATION') return

            sendException(error)
        } finally {
            closeLoadingScreen(1000)
        }
    }

const getConnectedPlayerIdsExcludeIds = (excludeIds) => {
    const { player } = window.game
    const connectedPlayerIds = player.getConnectedPlayerIds(20, 0)

    if (!excludeIds || excludeIds.length === 0) return connectedPlayerIds

    let result = []

    for (let i = 0; i < connectedPlayerIds.length; i++) {
        if (!excludeIds.includes(connectedPlayerIds[i])) {
            result.push(connectedPlayerIds[i])
        }
    }

    return result
}

export const startMultiModeGameRandomFriends = () => async (dispatch) => {
    try {
        const { player, facebook, globalScene, lang } = window.game
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        const connectedPlayerIds = getConnectedPlayerIdsExcludeIds(listPlayerIds)

        let opponentId = ''
        let contextId = ''
        let contextType = facebook.contextType

        console.log('listPlayerIds === ', listPlayerIds, connectedPlayerIds)

        if (connectedPlayerIds.length > 0) {
            // eslint-disable-next-line no-undef
            const rand = Phaser.Math.RND.between(0, connectedPlayerIds.length - 1)
            opponentId = connectedPlayerIds[rand]

            listPlayerIds.push(opponentId)

            console.log('listPlayerIds === ', listPlayerIds)
        }

        if (opponentId && typeof opponentId === 'string') {
            contextId = await facebook.createAsync(opponentId)
        }

        validateContextId({ contextId })

        const playerId = player.getPlayerId()
        const players = await facebook.getContextPlayers(playerId)

        // Default opponent
        let opponent = SampleOpponent

        if (!opponentId && players.length === 1) {
            opponent = players[0] || SampleOpponent
        }

        // dispatch(clearChallengeMatchData());

        dispatch(clearMatchDataStats())

        const { name, photo } = opponent
        const opponentInfo = { playerId: opponentId, name, photo }

        await dispatch(startGame(MATCH_MODE_CHALLENGE_FRIENDS, opponentInfo))

        dispatch(contextProcessed(contextId, contextType))
    } catch (error) {
        if (error instanceof InvalidContextId) {
            // Start single mode when cancel choose async
            dispatch(updateGame({ mode: MATCH_MODE_SINGLE, status: MATCH_STATUS_OPEN }))
            dispatch(startSingleModeGame())
            return
        }

        sendException(error)
    } finally {
        closeLoadingScreen(1000)
    }
}

export const startMatchingGroupModeGame = (opponentInfo) => async (dispatch) => {
    try {
        const { facebook, globalScene, analytics, lang } = window.game
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        const contextId = facebook.getContextID()
        validateContextId({ contextId })

        analytics.event(AnalyticsEvents.JOIN_GROUP, { group_id: contextId })

        await dispatch(startGame(MATCH_MODE_MATCHING_GROUP, opponentInfo))
    } catch (error) {
        if (error instanceof InvalidContextId) return

        if (error?.code === 'INVALID_OPERATION') return

        sendException(error)
    } finally {
        closeLoadingScreen(1000)
    }
}

export const continueChallengeGame = (matchId, opponentId) => async (dispatch, getState) => {
    try {
        const { player, profile, facebook, globalScene, lang } = window.game

        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        let state = getState()
        const playerId = player.getPlayerId(state)
        const connectedPlayers = player.getConnectedPlayers(state)

        // * Cannot play challenge friend on a opponent is not in friend list
        if (connectedPlayers.length > 0 && !connectedPlayers[opponentId]) {
            globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.DASHBOARD_SCENE)
            return
        }

        // Default opponent
        let opponentInfo = SampleOpponent

        const players = await facebook.getContextPlayers(playerId)

        // Opponent from entry data is a friend
        if (
            opponentId !== playerId &&
            opponentId !== opponentInfo.playerId &&
            connectedPlayers[opponentId]
        ) {
            opponentInfo = connectedPlayers[opponentId]
        }

        // If only have 1 friend in context
        else if (players.length === 1) {
            opponentInfo = players[0]
        } else {
            // Get opponent info from profile
            await profile.requestProfiles([opponentId])
            const profiles = profile.getProfiles()

            if (profiles[opponentId]) {
                opponentInfo = profiles[opponentId]
            }
        }

        await dispatch(continueChallengeMatch(matchId, opponentInfo))

        state = getState()

        let playerIdInChallengeMatch = getChallengeMatchPlayerId(state, {
            playerId,
        })

        // Is match not have opponent
        if (playerIdInChallengeMatch === SampleOpponent.playerId) {
            await dispatch(joinChallengeMatch(matchId))
        }

        state = getState()
        playerIdInChallengeMatch = getChallengeMatchPlayerId(state, { playerId })

        // Is player cannot join this match, and opponentId is a friend
        if (playerIdInChallengeMatch !== playerId && connectedPlayers[opponentId]) {
            dispatch(challengeFriend(opponentId, true))
            return
        }

        const currentMatchId = getChallengeMatchId(state)

        // Valid matchId
        if (currentMatchId !== matchId) {
            globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.DASHBOARD_SCENE)
            return
        }

        const status = getChallengeMatchStatus(state)
        const isPlayerFinished = getIsPlayerFinishChallengeMatch(state, {
            playerId,
        })

        dispatch(updateGame({ mode: MATCH_MODE_CHALLENGE_FRIENDS, status }))

        const contextId = facebook.getContextID()
        const contextType = facebook.contextType
        dispatch(contextProcessed(contextId, contextType))

        if (isPlayerFinished) {
            // Request connected players for show more friends in GameOverScene
            await player.requestConnectedPlayers()

            globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.GAME_SCENE)
            return
        }

        globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.GAME_SCENE)
    } catch (error) {
        sendException(error)
    } finally {
        closeLoadingScreen(1000)
    }
}

export const startOnlineModeGame = () => (dispatch) => {
    try {
        dispatch(cleanOnlineMatch())

        dispatch(startGame(MATCH_MODE_ONLINE))
    } catch (error) {
        sendException(error)
    }
}

export const requestFinishGame = () => async (dispatch, getState) => {
    try {
        const { analytics, facebook, globalScene, lang } = window.game
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        let state = getState()
        const mode = getGameplayMode(state)
        const { score = 0, level = 0 } = getGameplayCurrentStats(state)

        dispatch(requestTournament(score))

        dispatch(setScoreData(score))

        await dispatch(finishGame(mode, { score }))

        state = getState()

        const startAt = getGameplayStartAt(state)
        const finishAt = getGameplayFinishAt(state)

        const seconds = Math.floor((finishAt - startAt) / 1000)
        analytics.event(AnalyticsEvents.MATCH_END, {
            game_mode: GameCore.Utils.String.toUpperCamelCase(mode),
            level: level,
            level_name: `level_${level}`,
            time_played: seconds,
        })

        const contextId = facebook.getContextID()
        if (mode === MATCH_MODE_MATCHING_GROUP && contextId) {
            dispatch(sendGroupMessage())
        }

        if (contextId && mode === MATCH_MODE_CHALLENGE_FRIENDS) {
            const { playerId: opponentId } = getChallengeMatchOpponentInfo(state)

            if (!opponentId || opponentId === SampleOpponent.playerId) return

            const stats = getGameplayStats(state)
            const { score: opponentScore = 0 } = stats[opponentId] || {}

            const challengeMatchData = getChallengeMatchData(state)
            const { _id: matchId, whitePlayerFinish, blackPlayerFinish } = challengeMatchData

            // Check white player not play game
            if (!whitePlayerFinish || !blackPlayerFinish) {
                dispatch(sendPlayMatchMessage(opponentId, { matchId, contextId, score }))
            } else {
                if (score > opponentScore) {
                    dispatch(sendBestScoreMessage(opponentId, { matchId, contextId }))
                } else {
                    dispatch(sendFinishMessage(opponentId, { matchId, contextId }))
                }
            }
        }
    } catch (error) {
        sendException(error)
    } finally {
        closeLoadingScreen(300)
    }
}

export const requestFinishLevel = () => async (dispatch, getState) => {
    try {
        let state = getState()
        const { score = 0 } = getGameplayCurrentStats(state)

        dispatch(setScoreData(score))
    } catch (error) {
        sendException(error)
    }
}

const setScoreData = (score) => (dispatch) => {
    try {
        const { player } = window.game
        const playerId = player.getPlayerId()

        // * This use for update score to leaderboads api
        setScoreAsync(playerId, score).catch((error) => {
            sendException(new Error(error))
        })

        const playerData = player.getPlayerData()
        const { score: bestScore = 0, level } = playerData

        if (bestScore < score) {
            player.setBestScore(score)
        }

        const stats = { score, level }

        dispatch(updateMatchDataStats(playerId, stats))
        dispatch(updateMatchCurrentStats(stats))
    } catch (error) {
        if (error instanceof NewScoreIsBad) return
        sendException(error)
    }
}

const startGame =
    (mode, opponentInfo = null) =>
    async (dispatch, getState) => {
        try {
            const { player, analytics, facebook, globalScene } = window.game

            let contextId = facebook.getContextID()

            let score = 0
            let state = getState()

            analytics.event(AnalyticsEvents.MATCH_START, {
                game_mode: GameCore.Utils.String.toUpperCamelCase(mode),
                level: 1,
                level_name: 'level_1',
            })

            dispatch(initializeGameplay())

            if ([MATCH_MODE_SINGLE, MATCH_MODE_TOURNAMENTS].includes(mode)) {
                await dispatch(getSingleMatchDetail())

                state = getState()
                const singleMatchId = getSingleMatchId(state)

                if (!singleMatchId) {
                    await dispatch(createSingleMatch())
                }

                score = getSingleMatchScore(state)
            }

            if (mode === MATCH_MODE_MATCHING_GROUP) {
                dispatch(createGroupMatch(opponentInfo))
            }

            if (mode === MATCH_MODE_CHALLENGE_FRIENDS) {
                await dispatch(createChallengeMatch(opponentInfo))

                state = getState()
                const challengeMatchId = getChallengeMatchId(state)
                const { playerId: opponentId } = getChallengeMatchOpponentInfo(state)

                if (!contextId) contextId = window.game.facebook.getContextID()

                const isSent = getMessagesSentStatus(state, { opponentId })

                if (contextId && opponentId && !isSent) {
                    dispatch(
                        sendInviteMessage(opponentId, { contextId, matchId: challengeMatchId })
                    )
                }
            }

            if (mode === MATCH_MODE_ONLINE) {
                dispatch(createOnlineMatch())
            }

            state = getState()
            const { score: bestScore = 0 } = player.getPlayerData(state)
            const matchData = getSingleMatchData(state)
            const { rescued = 0 } = matchData

            dispatch(updateMatchCurrentStats({ score, bestScore }))

            dispatch({
                type: MATCH_GAMEPLAY_START,
                payload: { mode, contextId, rescued },
            })

            dispatch(gameModeDetected(mode))

            globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.GAME_SCENE)
        } catch (error) {
            if (error instanceof InvalidMatchId) {
                const { globalScene, lang } = window.game
                globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
                    message: `${lang.Text.NO_REWARDS}\n${lang.Text.CANCELLED_AD}`,
                    duration: 2500,
                    loading: false,
                })
                return
            }

            sendException(error)
        } finally {
            closeLoadingScreen(0)
        }
    }

const startJourneyMode = () => async (dispatch, getState) => {
    try {
        const { analytics, facebook, globalScene } = window.game
        let contextId = facebook.getContextID()
        let state = getState()
        const level = getJourneyMatchLevel(state) || 1

        analytics.event(AnalyticsEvents.MATCH_START, {
            game_mode: GameCore.Utils.String.toUpperCamelCase(MATCH_MODE_JOURNEY),
            level,
        })

        dispatch(initializeGameplay())

        state = getState()
        const journeyMatchId = getJourneyMatchId(state)

        if (!journeyMatchId) {
            await dispatch(createJourneyMatch())
        }

        dispatch({
            type: MATCH_GAMEPLAY_START,
            payload: { mode: MATCH_MODE_JOURNEY, contextId },
        })

        globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.JOURNEY_SCENE)
    } catch (error) {
        if (error instanceof InvalidMatchId) {
            const { globalScene } = window.game
            globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
                message: 'Sorry!, you can now\ncreate this match!',
                duration: 2500,
                loading: false,
            })
            return
        }

        sendException(error)
    } finally {
        closeLoadingScreen(0)
    }
}

const finishGame = (mode, payload) => async (dispatch, getState) => {
    const { player } = window.game
    const { score = 0, level = 0 } = payload

    const state = getState()

    if ([MATCH_MODE_SINGLE, MATCH_MODE_TOURNAMENTS].includes(mode)) {
        const singleMatchId = getSingleMatchId(state)
        await dispatch(finishSingleMatch(singleMatchId))
    }

    if (mode === MATCH_MODE_MATCHING_GROUP) {
        dispatch(finishGroupMatch())

        const playerId = player.getPlayerId()
        dispatch(updateMatchDataStats(playerId, payload))
    }

    if (mode === MATCH_MODE_CHALLENGE_FRIENDS) {
        const challengeMatchId = getChallengeMatchId(state)
        await dispatch(finishChallengeMatch(challengeMatchId, score, { level }))
    }

    dispatch({
        type: MATCH_GAMEPLAY_FINISH,
        payload: { mode },
    })

    // globalScene.events.emit(SceneEvents.SWITCH, SceneKeys.GAME_OVER_SCENE)
    Emitter.emit(GAME_EVENT.GAME_OVER)
}

const updateGame = (data) => (dispatch) => {
    const { mode, status } = data

    dispatch({
        type: MATCH_GAMEPLAY_UPDATE,
        payload: { mode, status },
    })

    // ? Debug data for Sentry
    addBreadcrumbSentry('game-mode', mode)
}

export const useRescue = () => (dispatch, getState) => {
    const state = getState()
    const { level = 0 } = getGameplayCurrentStats(state)
    const mode = getGameplayMode(state)
    window.game.analytics.event(AnalyticsEvents.MATCH_RESCUE, {
        game_mode: GameCore.Utils.String.toUpperCamelCase(mode),
        level: level,
        level_name: `level_${level}`,
    })

    dispatch({
        type: MATCH_GAMEPLAY_RESCUE,
        payload: {},
    })
}

export const resetRescued = () => (dispatch) => {
    dispatch({
        type: MATCH_GAMEPLAY_RESET_RESCUE,
        payload: {},
    })

    writeByKeyLocalStorage(Match.SingleMatchStore, {
        rescued: 0,
    })
}
