import { ScreenKeys } from '@/game/constants/screens'
import { getByKeyLocalStorage, writeByKeyLocalStorage } from '@/utils/localStorage'
import { sendException } from '@/utils/Sentry'
import {
    createMatchAsync,
    finishMatchAsync,
    getMatchDetailByIdAsync,
    joinMatchAsync,
} from '../api/match'
import {
    MATCH_CHALLENGE_CONTINUE_REQUEST,
    MATCH_CHALLENGE_CREATE_REQUEST,
    MATCH_CHALLENGE_DATA_CLEAR,
    MATCH_CHALLENGE_DATA_RECEIVED,
    MATCH_CHALLENGE_FINISH_REQUEST,
    MATCH_CHALLENGE_JOIN_REQUEST,
    MATCH_GROUP_CREATE_REQUEST,
    MATCH_GROUP_FINISH_REQUEST,
    MATCH_JOURNEY_CREATE_REQUEST,
    MATCH_JOURNEY_DAILY_CHALLENGE_COMPLETED,
    MATCH_JOURNEY_DAILY_CHALLENGE_START,
    MATCH_JOURNEY_DATA_CLEAR,
    MATCH_JOURNEY_DATA_RECEIVED,
    MATCH_JOURNEY_LEVEL_RECEIVED,
    MATCH_JOURNEY_MOVE_UPDATED,
    MATCH_JOURNEY_SCORE_RECEIVED,
    MATCH_ONLINE_CREATE_REQUEST,
    MATCH_ONLINE_DATA_CLEAR,
    MATCH_ONLINE_DATA_RECEIVED,
    MATCH_ONLINE_FINISH_REQUEST,
    MATCH_SINGLE_CREATE_REQUEST,
    MATCH_SINGLE_DATA_CLEAR,
    MATCH_SINGLE_DATA_RECEIVED,
    MATCH_SINGLE_DETAIL_REQUEST,
    MATCH_SINGLE_FINISH_REQUEST,
    MATCH_SINGLE_MOVE_UPDATED,
} from '../constants/ActionTypes'
import { MATCH_STATUS_ACTIVE } from '../constants/MatchStatus'
import InvalidMatchId from '../exceptions/InvalidMatchId'
import InvalidMatchStatus from '../exceptions/InvalidMatchStatus'
import InvalidOpponentId from '../exceptions/InvalidOpponentId'
import InvalidPlayerId from '../exceptions/InvalidPlayerId'
import {
    getJourneyChallengeMode,
    getJourneyMatchData,
    getJourneyMatchId,
    getJourneyMatchLevel,
    getSingleMatchData,
    getSingleMatchId,
} from '../selectors/match'
import {
    validateMatchData,
    validateMatchId,
    validateOpponentId,
    validateSingleMatchData,
    validateSingleMatchFinishData,
    validateSingleMatchInput,
    validateSingleMatchMoveData,
} from './validation'

const { Match } = GameCore.Configs

const encodeMathData = (data) => {
    try {
        return GameCore.Utils.Hash.stringToHash(JSON.stringify(data))
    } catch (error) {
        return ''
    }
}

const decodeMathData = (hash) => {
    try {
        return JSON.parse(GameCore.Utils.Hash.hashToString(hash))
    } catch (error) {
        return ''
    }
}

// Single mode
export const loadSingleMatch = () => (dispatch) => {
    try {
        // Get single match form localStore
        const singleMatch = getByKeyLocalStorage(Match.SingleMatchStore)

        if (!GameCore.Utils.Valid.isObject(singleMatch)) return

        // Decode match data
        const { data } = singleMatch
        singleMatch.data = decodeMathData(data)

        if (typeof singleMatch === 'object' && singleMatch !== null) {
            // Update single match data
            const { _id } = singleMatch || {}
            if (_id === Match.localSingleMatchDefault._id) {
                dispatch(receiveSingleMatch(singleMatch))
            }
        } else {
            // Create single match data
            dispatch(createSingleMatch())
        }
    } catch (error) {
        sendException(error)
    }
}

export const createSingleMatch = () => async (dispatch) => {
    try {
        const { player, globalScene, lang } = window.game

        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        dispatch({
            type: MATCH_SINGLE_CREATE_REQUEST,
            payload: {},
        })

        const playerId = player.getPlayerId()

        const match = {
            ...Match.LocalSingleMatchDefault,
            status: 'active',
            playerId,
            startedAt: Date.now(),
            rescued: 0,
        }

        validateSingleMatchData({ playerId, match })

        dispatch(receiveSingleMatch(match))

        writeByKeyLocalStorage(Match.SingleMatchStore, match)
    } catch (error) {
        dispatch(receiveSingleMatch(null))
        if (error instanceof InvalidMatchId) return
        if (error instanceof InvalidMatchStatus) return
        sendException(error)
    }
}

export const createJourneyMatch = () => async (dispatch, getState) => {
    try {
        const { player, globalScene, lang } = window.game

        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        dispatch({
            type: MATCH_JOURNEY_CREATE_REQUEST,
            payload: {},
        })

        const state = getState()
        const level = getJourneyMatchLevel(state) || 1
        const challengeMode = getJourneyChallengeMode(state)
        const playerId = player.getPlayerId()

        const match = {
            ...Match.LocalSingleMatchDefault,
            level,
            status: 'active',
            playerId,
            challengeMode,
            startedAt: Date.now(),
            updateAt: Date.now(),
        }

        validateSingleMatchData({ playerId, match })

        dispatch(receiveJourneyMatch(match))

        writeByKeyLocalStorage(`${Match.JourneyMatchStore}-${playerId}`, match)
    } catch (error) {
        dispatch(receiveJourneyMatch(null))
        if (error instanceof InvalidMatchId) return
        if (error instanceof InvalidMatchStatus) return
        sendException(error)
    }
}

export const getSingleMatchDetail = () => (dispatch) => {
    try {
        const { player } = window.game

        dispatch({
            type: MATCH_SINGLE_DETAIL_REQUEST,
            payload: {},
        })

        const playerId = player.getPlayerId()

        const match = getByKeyLocalStorage(Match.SingleMatchStore) || {}

        // Decode data
        const { data } = match
        match.data = decodeMathData(data)

        validateSingleMatchData({ playerId, match })

        dispatch(receiveSingleMatch(match))
    } catch (error) {
        dispatch(receiveSingleMatch(null))
        if (error instanceof InvalidMatchId) return
        if (error instanceof InvalidPlayerId) return
        if (error instanceof InvalidMatchStatus) return
        sendException(error)
    }
}

export const getJourneyMatchDetail = () => (dispatch, getState) => {
    try {
        const { player } = window.game

        dispatch({
            type: MATCH_SINGLE_DETAIL_REQUEST,
            payload: {},
        })

        const playerId = player.getPlayerId()
        const state = getState()
        const match = getJourneyMatchData(state)

        validateSingleMatchData({ playerId, match })

        dispatch(receiveJourneyMatch(match))
    } catch (error) {
        dispatch(receiveJourneyMatch(null))
        if (error instanceof InvalidMatchId) return
        if (error instanceof InvalidPlayerId) return
        if (error instanceof InvalidMatchStatus) return
        sendException(error)
    }
}

export const updateSingleMatchMove = (matchId, payload) => (dispatch, getState) => {
    try {
        validateSingleMatchInput({ matchId, ...payload })

        const state = getState()
        const currentMatchId = getSingleMatchId(state)

        validateSingleMatchMoveData({ matchId, currentMatchId })

        dispatch({
            type: MATCH_SINGLE_MOVE_UPDATED,
            payload: { match: payload },
        })

        // Encode data
        const { data } = payload
        payload.data = encodeMathData(data)

        writeByKeyLocalStorage(Match.SingleMatchStore, payload)
    } catch (error) {
        if (error instanceof InvalidMatchId) return
        sendException(error)
    }
}

export const updateJourneyMatchMove = (matchId, payload) => (dispatch, getState) => {
    try {
        validateSingleMatchInput({ matchId, ...payload })

        const state = getState()
        const currentMatchId = getJourneyMatchId(state)

        validateSingleMatchMoveData({ matchId, currentMatchId })

        dispatch({
            type: MATCH_JOURNEY_MOVE_UPDATED,
            payload: { match: payload },
        })

        // Encode data
        const { data } = payload

        payload.data = encodeMathData(data)
        payload.challengeMode = false

        const { player } = window.game

        writeByKeyLocalStorage(`${Match.JourneyMatchStore}-${player.getPlayerId()}`, payload)
    } catch (error) {
        if (error instanceof InvalidMatchId) return
        sendException(error)
    }
}

export const finishSingleMatch = (matchId) => async (dispatch, getState) => {
    try {
        const { player } = window.game

        validateMatchId({ matchId })

        const state = getState()
        const currentMatchId = getSingleMatchId(state)

        const playerId = player.getPlayerId()

        validateSingleMatchFinishData({ matchId, currentMatchId })

        dispatch({
            type: MATCH_SINGLE_FINISH_REQUEST,
            payload: { matchId },
        })

        const matchData = getSingleMatchData(state)

        validateSingleMatchData({ playerId, match: matchData })

        const match = {
            ...Match.LocalSingleMatchDefault,
            ...matchData,
            _id: matchId,
            status: 'finished',
            playerId,
            finishAt: Date.now(),
        }

        dispatch(receiveSingleMatch(match))

        // Encode data
        const { data } = match

        const hashMatch = { ...match }
        hashMatch.data = encodeMathData(data)

        writeByKeyLocalStorage(Match.SingleMatchStore, hashMatch)
    } catch (error) {
        dispatch(receiveSingleMatch(null))
        if (error instanceof InvalidMatchId) return
        if (error instanceof InvalidMatchStatus) return
        sendException(error)
    }
}

const receiveSingleMatch = (match) => ({
    type: MATCH_SINGLE_DATA_RECEIVED,
    payload: { match },
})

const receiveJourneyMatch = (match) => ({
    type: MATCH_JOURNEY_DATA_RECEIVED,
    payload: { match },
})

export const clearSingleMatchData = () => ({
    type: MATCH_SINGLE_DATA_CLEAR,
    payload: {},
})

export const clearJourneyMatchData = () => ({
    type: MATCH_JOURNEY_DATA_CLEAR,
    payload: {},
})

// Challenge mode
export const createChallengeMatch = (opponentInfo) => async (dispatch) => {
    try {
        const { profile, globalScene, lang } = window.game

        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        const { playerId: opponentId } = opponentInfo
        validateOpponentId({ opponentId })

        dispatch({
            type: MATCH_CHALLENGE_CREATE_REQUEST,
            payload: { opponentInfo },
        })

        const match = await createMatchAsync(opponentId)

        validateMatchData({ match })

        await profile.requestProfiles([opponentId])

        dispatch(receiveChallengeMatch(match))
    } catch (error) {
        dispatch(receiveChallengeMatch(null))
        if (error instanceof InvalidMatchId) return
        if (error instanceof InvalidOpponentId) return
        sendException(error)
    }
}

export const joinChallengeMatch =
    (matchId, showLoading = true) =>
    async (dispatch) => {
        try {
            const { player, profile, globalScene, lang } = window.game

            if (showLoading) {
                globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
                    message: lang.Text.LOADING,
                    loading: true,
                })
            }

            validateMatchId({ matchId })

            dispatch({
                type: MATCH_CHALLENGE_JOIN_REQUEST,
                payload: { matchId },
            })

            const match = await joinMatchAsync(matchId)

            validateMatchData({ match })

            const { status, whitePlayerId, blackPlayerId } = match

            if (status === MATCH_STATUS_ACTIVE) {
                const playerId = player.getPlayerId()

                const isPlayerWhite = playerId === whitePlayerId
                const opponentId = isPlayerWhite ? blackPlayerId : whitePlayerId

                await profile.requestProfiles([opponentId])
            }

            dispatch(receiveChallengeMatch(match))
        } catch (error) {
            dispatch(receiveChallengeMatch(null))
            if (error instanceof InvalidMatchId) return
            sendException(error)
        }
    }

export const continueChallengeMatch = (matchId, opponentInfo) => async (dispatch) => {
    try {
        const { player, globalScene, lang } = window.game

        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        validateMatchId({ matchId })

        dispatch({
            type: MATCH_CHALLENGE_CONTINUE_REQUEST,
            payload: { matchId, opponentInfo },
        })

        const match = await getMatchDetailByIdAsync(matchId)

        validateMatchData({ match })

        const { whitePlayerId, whitePlayerScore, blackPlayerScore } = match

        const playerId = player.getPlayerId()
        const { score: bestScore } = player.getPlayerData()

        const isPlayerWhite = playerId === whitePlayerId

        const current = {
            score: isPlayerWhite ? whitePlayerScore : blackPlayerScore,
            bestScore,
        }

        dispatch(receiveChallengeMatch(match, current))
    } catch (error) {
        dispatch(receiveChallengeMatch(null))
        if (error instanceof InvalidMatchId) return
        sendException(error)
    }
}

export const finishChallengeMatch = (matchId, score, extraData) => async (dispatch) => {
    try {
        const { globalScene, lang } = window.game
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        validateMatchId({ matchId })

        dispatch({
            type: MATCH_CHALLENGE_FINISH_REQUEST,
            payload: { matchId, score, extraData },
        })

        const { level } = extraData

        const match = await finishMatchAsync(matchId, score, level, extraData)

        validateMatchData({ match })

        await dispatch(receiveChallengeMatch(match))
    } catch (error) {
        dispatch(receiveChallengeMatch(null))
        if (error instanceof InvalidMatchId) return
        sendException(error)
    }
}

const receiveChallengeMatch = (match, opponentInfo, current = null) => ({
    type: MATCH_CHALLENGE_DATA_RECEIVED,
    payload: { match, opponentInfo, current },
})

export const clearChallengeMatchData = () => ({
    type: MATCH_CHALLENGE_DATA_CLEAR,
    payload: {},
})

// Matching Group
export const createGroupMatch = (opponentInfo) => ({
    type: MATCH_GROUP_CREATE_REQUEST,
    payload: { opponentInfo },
})

export const finishGroupMatch = () => ({
    type: MATCH_GROUP_FINISH_REQUEST,
    payload: {},
})

// Play Online
export const createOnlineMatch = () => async (dispatch) => {
    const { player } = window.game
    const { playerId, name, photo } = player.getPlayer()

    dispatch({
        type: MATCH_ONLINE_CREATE_REQUEST,
        payload: { playerId },
    })

    // TODO: get random 100 player on profile api
    const mockPlayers = {}

    new Array(20).fill(null).map((_, index) => {
        const id = `0${index + 1}`

        mockPlayers[id] = {
            playerId: id,
            name: `MPlayer ${id}`,
            photo: './assets/images/others/avatar.png',
        }
    })

    // Add current player
    mockPlayers[playerId] = { playerId, name, photo }

    dispatch(receiveOnlineMatch('mock', mockPlayers))
}

const receiveOnlineMatch = (matchId, players) => ({
    type: MATCH_ONLINE_DATA_RECEIVED,
    payload: { matchId, players },
})

export const cleanOnlineMatch = () => ({
    type: MATCH_ONLINE_DATA_CLEAR,
    payload: {},
})

export const finishOnlineMatch = () => ({
    type: MATCH_ONLINE_FINISH_REQUEST,
    payload: {},
})

export const loadLevel = () => async (dispatch) => {
    const { player } = window.game
    const { playerId } = player.getPlayer()

    try {
        dispatch({
            type: MATCH_SINGLE_DETAIL_REQUEST,
            payload: {},
        })

        let { level } = await window.FBInstant.player.getDataAsync(['level'])

        const match = getByKeyLocalStorage(`${Match.JourneyMatchStore}-${playerId}`) || {}

        // Decode data
        const { data, level: levelStorage } = match
        match.data = decodeMathData(data)

        if (level !== levelStorage) {
            match.data = {}
        }

        let correctLevel = level || 1

        // if (correctLevel > GAME_LEVELS.length - 1) correctLevel = GAME_LEVELS.length - 1

        const correctData = {
            ...match,
            level: correctLevel,
            playerId,
        }

        dispatch({
            type: MATCH_JOURNEY_MOVE_UPDATED,
            payload: { match: correctData },
        })
    } catch (error) {
        //
        console.log('Erorrrrr = ', error)
    }
}

export const startJourneyDailyChallengeMode = () => async (dispatch) => {
    dispatch({
        type: MATCH_JOURNEY_DAILY_CHALLENGE_START,
        payload: {},
    })
}

export const completeJourneyDailyChallengeMode = () => async (dispatch) => {
    dispatch({
        type: MATCH_JOURNEY_DAILY_CHALLENGE_COMPLETED,
        payload: {},
    })
}

export const updateMatchDataJourney = (payload) => (dispatch, getState) => {
    const { player } = window.game
    const playerId = player.getPlayerId()
    const state = getState()
    const matchData = getJourneyMatchData(state)
    const match = {
        ...matchData,
        ...payload,
    }

    const { data } = match
    match.data = encodeMathData(data)

    dispatch(receiveJourneyMatch(match))

    writeByKeyLocalStorage(`${Match.JourneyMatchStore}-${playerId}`, match)
}

export const updateMatchJourneyScore = (score) => ({
    type: MATCH_JOURNEY_SCORE_RECEIVED,
    payload: { score },
})

export const updateMatchJourneyLevel = (level) => ({
    type: MATCH_JOURNEY_LEVEL_RECEIVED,
    payload: { level },
})
