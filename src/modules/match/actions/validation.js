import InvalidBlackPlayerId from '../exceptions/InvalidBlackPlayerId'
import InvalidMatchId from '../exceptions/InvalidMatchId'
import InvalidMatchStatus from '../exceptions/InvalidMatchStatus'
import InvalidOpponentId from '../exceptions/InvalidOpponentId'
import InvalidPlayerId from '../exceptions/InvalidPlayerId'
import InvalidRequestedMatchId from '../exceptions/InvalidRequestedMatchId'
import InvalidScore from '../exceptions/InvalidScore'
import InvalidWhitePlayerId from '../exceptions/InvalidWhitePlayerId'

// Validator
export const validateSingleMatchInput = (payload) => {
    const { matchId, score } = payload

    if (matchId === '' || typeof matchId !== 'string') {
        throw new InvalidMatchId(null, { matchId })
    }

    if (typeof score !== 'number') {
        throw new InvalidScore(null, { score })
    }
}

export const validateSingleMatchMoveData = (payload) => {
    const { matchId, currentMatchId } = payload

    if (matchId === '' || typeof matchId !== 'string') {
        throw new InvalidMatchId(null, { matchId })
    }

    if (currentMatchId === '' || typeof currentMatchId !== 'string') {
        throw new InvalidMatchId(null, { currentMatchId })
    }

    if (matchId !== currentMatchId) {
        throw new InvalidRequestedMatchId(null, { matchId, currentMatchId })
    }
}

export const validateSingleMatchFinishData = (payload) => {
    const { matchId, currentMatchId } = payload

    if (matchId === '' || typeof matchId !== 'string') {
        throw new InvalidMatchId(null, { matchId })
    }

    if (currentMatchId === '' || typeof currentMatchId !== 'string') {
        throw new InvalidMatchId(null, { currentMatchId })
    }

    if (matchId !== currentMatchId) {
        throw new InvalidRequestedMatchId(null, { matchId, currentMatchId })
    }
}

export const validateSingleMatchData = (payload) => {
    const { playerId: currentPlayerId, match } = payload
    const { _id: matchId, playerId, status } = match

    if (matchId === '' || typeof matchId !== 'string') {
        throw new InvalidMatchId(null, { matchId })
    }

    if (status === 'finished' || typeof status !== 'string') {
        throw new InvalidMatchStatus('This match is finished', { status })
    }

    if (playerId !== currentPlayerId) {
        throw new InvalidPlayerId(null, { playerId, currentPlayerId })
    }
}

export const validateOpponentId = (payload) => {
    const { opponentId } = payload

    if (opponentId === '' || typeof opponentId !== 'string') {
        throw new InvalidOpponentId(null, { opponentId })
    }
}

export const validateMatchId = (payload) => {
    const { matchId } = payload

    if (matchId === '' || typeof matchId !== 'string') {
        throw new InvalidMatchId(null, { matchId })
    }
}

export const validateMatchData = (payload) => {
    const { match } = payload
    const { _id: matchId, whitePlayerId, blackPlayerId } = match

    if (matchId === '' || typeof matchId !== 'string') {
        throw new InvalidMatchId(null, { matchId })
    }

    if (whitePlayerId === '' || typeof whitePlayerId !== 'string') {
        throw new InvalidWhitePlayerId(null, { whitePlayerId })
    }

    if (blackPlayerId === '' || typeof blackPlayerId !== 'string') {
        throw new InvalidBlackPlayerId(null, { blackPlayerId })
    }
}
