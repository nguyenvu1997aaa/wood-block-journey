import { MESSAGES_SENT_REMOVE, MESSAGES_SENT_UPDATE } from '@/constants/ActionTypes'
import { AnalyticsEvents } from '@/constants/Analytics'
import {
    CHALLENGE_FRIEND_MATCH,
    MATCHING_GROUP_MATCH,
    SHARE_INVITE,
} from '@/constants/ContextTypes'
import { SampleOpponent } from '@/constants/SampleOpponent'
import InvalidContextId from '@/exceptions/InvalidContextId'
import InvalidOpponentId from '@/exceptions/InvalidOpponentId'
import WideFrameRenderFail from '@/exceptions/WideFrameRenderFail'
import TASKS from '@/modules/daily-tasks/constants/Tasks'
import { MATCH_STATUS_ACTIVE, MATCH_STATUS_FINISHED } from '@/modules/match/constants/MatchStatus'
import { getGroupMatchOpponentInfo } from '@/modules/match/selectors/match'
import { getGameplayCurrentStats, getGameplayStats } from '@/modules/match/selectors/stats'
import { getMessages } from '@/redux/selectors/messages'
import Emitter from '@/utils/emitter'
import { sendException } from '@/utils/Sentry'
import {
    renderWideframesBestScore,
    renderWideframesCurrentScore,
    renderWideframesGameResult,
    renderWideframesGroupMatchResult,
} from './share'

interface IPayload {
    matchId: string
    contextId: string
    score?: number
}

// Validator
const validateContextId = (payload: TObject) => {
    const { contextId } = payload

    if (contextId === '' || typeof contextId !== 'string') {
        throw new InvalidContextId(null, { contextId })
    }
}

const validateSwitchContextInput = (payload: TObject) => {
    const { opponentId, contextId } = payload

    if (opponentId === '' || typeof opponentId !== 'string') {
        throw new InvalidOpponentId(null, { opponentId })
    }

    if (contextId === '' || typeof contextId !== 'string') {
        throw new InvalidContextId(null, { contextId })
    }
}

const validateRenderImage = (payload: TObject) => {
    const { imageShare } = payload

    if (imageShare === null) {
        throw new WideFrameRenderFail()
    }
}

// Actions
const processMessage =
    (opponentId: string, logged = true) =>
    (dispatch: IDispatch, getState: IGetSate) => {
        const state = getState()
        const messages = getMessages(state)

        if (logged) {
            if (messages[opponentId]?.sent) return
            dispatch(messageSentUpdate(opponentId))
        }

        if (messages[opponentId]?.sent) {
            dispatch(messageSentRemove(opponentId))
        }
    }

const messageSentUpdate = (opponentId: string) => ({
    type: MESSAGES_SENT_UPDATE,
    payload: { opponentId },
})

const messageSentRemove = (opponentId: string) => ({
    type: MESSAGES_SENT_REMOVE,
    payload: { opponentId },
})

const switchContext = async (opponentId: string, contextId: string) => {
    try {
        const { facebook } = window.game

        validateSwitchContextInput({ opponentId, contextId })

        const currentContextId = window.game.facebook.getContextID()

        if (currentContextId === contextId && contextId !== '') {
            return currentContextId
        }

        if (opponentId === '10' && contextId !== '') return contextId

        if (contextId) {
            await facebook.switchAsync(contextId)
            return window.game.facebook.getContextID()
        }
    } catch (error) {
        sendException(error)
    }

    return ''
}

export const sendInviteMessage =
    (opponentId: string, payload: IPayload) => async (dispatch: IDispatch, getState: IGetSate) => {
        const { player, analytics, facebook } = window.game

        try {
            const { matchId, contextId: currentContextId } = payload
            const contextId = await switchContext(opponentId, currentContextId)

            validateContextId({ contextId })

            const state = getState()
            const imageShare = await renderWideframesGameResult(state)

            validateRenderImage({ imageShare })

            const { name: playerName, playerId } = player.getPlayer()

            const text = window.game.lang.getText({
                key: 'MESSAGE_INVITE',
                variables: [playerName],
            })

            await facebook.sendMessage({
                cta: 'Play',
                text,
                image: imageShare || '',
                template: 'challenge',
                data: {
                    type: CHALLENGE_FRIEND_MATCH,
                    matchId,
                    playerId,
                    opponentId,
                    status: MATCH_STATUS_ACTIVE,
                },
            })

            dispatch(processMessage(opponentId))

            analytics.event(AnalyticsEvents.MESSAGE, {
                message_content_type: 'Invite',
                success: true,
            })

            Emitter.emit(TASKS.INVITE_FRIENDS.EVENTS.INVITED_FRIEND, {
                type: 'friend',
                value: 1,
                opponentId,
            })
        } catch (error) {
            analytics.event(AnalyticsEvents.MESSAGE, {
                message_content_type: 'Invite',
                success: false,
            })

            sendException(error)
        }
    }

export const sendFinishMessage =
    (opponentId: string, payload: IPayload) => async (dispatch: IDispatch, getState: IGetSate) => {
        const { player, analytics, facebook } = window.game

        try {
            const { matchId, contextId: currentContextId } = payload

            const contextId = await switchContext(opponentId, currentContextId)

            validateContextId({ contextId })

            const state = getState()
            const imageShare = await renderWideframesGameResult(state)

            validateRenderImage({ imageShare })

            const { name: playerName, playerId } = player.getPlayer()

            const text = window.game.lang.getText({
                key: 'MESSAGE_FINISH_MATCH',
                variables: [playerName],
            })

            await facebook.sendMessage({
                cta: 'See result',
                text: text,
                image: imageShare || '',
                template: 'finished',
                data: {
                    type: CHALLENGE_FRIEND_MATCH,
                    matchId,
                    playerId,
                    opponentId,
                    status: MATCH_STATUS_FINISHED,
                },
            })

            dispatch(processMessage(opponentId))

            analytics.event(AnalyticsEvents.MESSAGE, {
                message_content_type: 'FinishMatch',
                success: true,
            })
        } catch (error) {
            analytics.event(AnalyticsEvents.MESSAGE, {
                message_content_type: 'FinishMatch',
                success: false,
            })

            sendException(error)
        }
    }

export const sendBestScoreMessage =
    (opponentId: string, payload: IPayload) => async (dispatch: IDispatch, getState: IGetSate) => {
        const { player, analytics, facebook } = window.game

        try {
            const { matchId, contextId: currentContextId } = payload

            const contextId = await switchContext(opponentId, currentContextId)

            validateContextId({ contextId })

            const state = getState()
            const imageShare = await renderWideframesGameResult(state)

            validateRenderImage({ imageShare })

            const { name: playerName, playerId } = player.getPlayer()

            const dataStats = getGameplayStats(state)
            const { score: playerScore = 0 } = dataStats[playerId] || {}

            const text = window.game.lang.getText({
                key: 'MESSAGE_BEST_SCORE',
                variables: [playerName, playerScore],
            })

            await facebook.sendMessage({
                cta: 'See result',
                text,
                image: imageShare || '',
                template: 'pass_score',
                data: {
                    type: CHALLENGE_FRIEND_MATCH,
                    matchId,
                    playerId,
                    opponentId,
                    status: MATCH_STATUS_FINISHED,
                },
            })

            dispatch(processMessage(opponentId))

            analytics.event(AnalyticsEvents.MESSAGE, {
                message_content_type: 'BestScore',
                success: true,
            })
        } catch (error) {
            analytics.event(AnalyticsEvents.MESSAGE, {
                message_content_type: 'BestScore',
                success: false,
            })

            sendException(error)
        }
    }

export const sendPlayMatchMessage =
    (opponentId: string, payload: IPayload) => async (dispatch: IDispatch, getState: IGetSate) => {
        const { player, analytics, facebook } = window.game

        try {
            const { matchId, contextId: currentContextId, score } = payload

            const contextId = await switchContext(opponentId, currentContextId)

            validateContextId({ contextId })

            const state = getState()
            const imageShare = await renderWideframesGameResult(state)

            validateRenderImage({ imageShare })

            const { name: playerName, playerId } = player.getPlayer()

            const text = window.game.lang.getText({
                key: 'MESSAGE_FINISH_TURN',
                variables: [playerName, score],
            })

            await facebook.sendMessage({
                cta: 'Play',
                text,
                image: imageShare || '',
                template: 'play_turn',
                data: {
                    type: CHALLENGE_FRIEND_MATCH,
                    matchId,
                    playerId,
                    opponentId,
                    status: MATCH_STATUS_ACTIVE,
                },
            })

            dispatch(processMessage(opponentId))

            analytics.event(AnalyticsEvents.MESSAGE, {
                message_content_type: 'FinishTurn',
                success: true,
            })
        } catch (error) {
            analytics.event(AnalyticsEvents.MESSAGE, {
                message_content_type: 'FinishTurn',
                success: false,
            })
            if (error instanceof InvalidContextId) return

            sendException(error)
        }
    }

export const sendGroupMessage = () => async (_: unused, getState: IGetSate) => {
    const { analytics } = window.game

    try {
        const contextId = window.game.facebook.getContextID()

        validateContextId({ contextId })

        const state = getState()
        const opponentInfo = getGroupMatchOpponentInfo(state)
        const { playerId: opponentId, score: opponentScore } = opponentInfo

        const { score: playerScore } = getGameplayCurrentStats(state)

        let imageShare

        // Playing with other player
        if (opponentId && opponentId !== SampleOpponent.playerId) {
            const isPlayerWin = playerScore > opponentScore

            if (isPlayerWin) {
                imageShare = await renderWideframesGroupMatchResult(state)
                await winMessage(imageShare, state)
            } else {
                imageShare = await renderWideframesCurrentScore(state)
                await challengeMessage(imageShare, state)
            }
        } else {
            imageShare = await renderWideframesCurrentScore(state)
            await challengeMessage(imageShare, state)
        }

        validateRenderImage({ imageShare })

        analytics.event(AnalyticsEvents.MESSAGE, {
            message_content_type: 'InviteGroup',
            success: true,
        })
    } catch (error) {
        analytics.event(AnalyticsEvents.MESSAGE, {
            message_content_type: 'InviteGroup',
            success: true,
        })

        sendException(error)
    }
}

const winMessage = async (imageShare: string | undefined, state: IState) => {
    try {
        const { player, facebook } = window.game
        const { playerId, name: playerName, photo: playerPhoto } = player.getPlayer()
        const { score: playerScore } = getGameplayCurrentStats(state)

        const entryData = {
            type: MATCHING_GROUP_MATCH,
            playerId,
            playerName,
            playerPhoto,
            playerScore,
        }

        await facebook.sendMessage({
            cta: {
                default: 'Play',
                localizations: {
                    en_US: 'Play',
                    vi_VN: 'Chơi',
                },
            },
            text: {
                default: `${playerName} beats your high score. Their score: ${playerScore}.`,
                localizations: {
                    en_US: `${playerName} beats your high score. Their score: ${playerScore}.`,
                    vi_VN: `${playerName} vừa vượt điểm số cao nhất của bạn! Chơi lần nữa chứ?`,
                },
            },
            image: imageShare || '',
            template: 'play_turn',
            data: entryData,
        })
    } catch (error) {
        sendException(error)
    }
}

const challengeMessage = async (imageShare: string | undefined, state: IState) => {
    const { player, facebook } = window.game
    try {
        const { playerId, name: playerName, photo: playerPhoto } = player.getPlayer()
        const { score: playerScore } = getGameplayCurrentStats(state)

        const entryData = {
            type: MATCHING_GROUP_MATCH,
            playerId,
            playerName,
            playerPhoto,
            playerScore,
        }

        await facebook.sendMessage({
            cta: {
                default: 'Play',
                localizations: {
                    en_US: 'Play',
                    vi_VN: 'Chơi ngay',
                },
            },
            text: {
                default: `${playerName} got ${playerScore} scores. So easy! Can you?`,
                localizations: {
                    en_US: `${playerName} got ${playerScore} scores. So easy! Can you?`,
                    vi_VN: `${playerName} đã đạt ${playerScore} điểm! Quá dễ luôn. Chơi lại nào!`,
                },
            },
            image: imageShare || '',
            template: 'play_turn',
            data: entryData,
        })
    } catch (error) {
        sendException(error)
    }
}

export const sendBestScoreForContextSolo = () => async (_: unused, getState: IGetSate) => {
    const { player, analytics, facebook } = window.game

    try {
        const contextId = window.game.facebook.getContextID()
        if (contextId) return

        const state = getState()
        const imageShare = await renderWideframesBestScore()

        validateRenderImage({ imageShare })

        const { playerId, name: playerName, photo: playerPhoto } = player.getPlayer()

        const { score: playerScore } = getGameplayCurrentStats(state)

        const entryData = {
            type: SHARE_INVITE,
            playerId,
            playerName,
            playerPhoto,
            playerScore,
        }

        const text = window.game.lang.getText({
            key: 'MESSAGE_FINISH_TURN',
            variables: [playerName, playerScore],
        })

        await facebook.sendMessage({
            cta: 'Play',
            text,
            image: imageShare || '',
            template: 'play_turn',
            data: entryData,
        })

        analytics.event(AnalyticsEvents.MESSAGE, {
            message_content_type: 'BestScoreContextSolo',
            success: true,
        })
    } catch (error) {
        analytics.event(AnalyticsEvents.MESSAGE, {
            message_content_type: 'BestScoreContextSolo',
            success: false,
        })

        sendException(error)
    }
}
