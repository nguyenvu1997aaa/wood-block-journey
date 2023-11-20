import { SampleOpponent } from '@/constants/SampleOpponent'
import { createSelector } from 'reselect'
import { getState } from './index'

const getPlayerIdProps = (_, props) => props.playerId
const getOpponentIdProps = (_, props) => props.opponentId

const getMatchRequestingState = (state) => getState(state).match.isRequesting

// Single
const getSingleMatchDataState = (state) => getState(state).match.single
const getSingleMatchIdState = (state) => getState(state).match.single._id
const getSingleMatchScoreState = (state) => getState(state).match.single.score
const getSingleMatchLevelState = (state) => getState(state).match.single.level
const getSingleMatchFenState = (state) => getState(state).match.single.data?.fen
const getSingleMatchDiamondState = (state) => getState(state).match.single.data?.diamond
const getSingleMatchStatusState = (state) => getState(state).match.single.status
const getSingleMatchPlayerIdState = (state) => getState(state).match.single.playerId

// Challenge
const getChallengeMatchDataState = (state) => getState(state).match.challenge
const getChallengeMatchIdState = (state) => getState(state).match.challenge._id
const getChallengeMatchStatusState = (state) => getState(state).match.challenge.status
const getChallengeMatchOpponentInfoState = (state) => getState(state).match.challenge.opponentInfo
const getChallengeMatchWhitePlayerIdState = (state) => getState(state).match.challenge.whitePlayerId
const getChallengeMatchBlackPlayerIdState = (state) => getState(state).match.challenge.blackPlayerId

// Group
const getGroupMatchOpponentInfoState = (state) => getState(state).match.group.opponentInfo

// Online
const getOnlineMatchPlayersState = (state) => getState(state).match.online.players

// Journey
const getJourneyMatchDataState = (state) => getState(state).match.journey
const getJourneyMatchIdState = (state) => getState(state).match.journey._id
const getJourneyMatchLevelState = (state) => getState(state).match.journey.level
const getJourneyChallengeModeState = (state) => getState(state).match.journey.challengeMode
const getJourneyMatchScoreState = (state) => getState(state).match.journey.score

export const getMatchRequesting = createSelector(
    [getMatchRequestingState],
    (isRequesting) => isRequesting
)

export const getSingleMatchData = createSelector([getSingleMatchDataState], (data) => data)

export const getSingleMatchId = createSelector([getSingleMatchIdState], (matchId) => matchId)

export const getSingleMatchScore = createSelector([getSingleMatchScoreState], (score) => score || 0)

export const getSingleMatchLevel = createSelector([getSingleMatchLevelState], (level) => level || 0)

export const getSingleMatchDiamond = createSelector(
    [getSingleMatchDiamondState],
    (diamond) => diamond || 0
)

export const getSingleMatchFen = createSelector([getSingleMatchFenState], (fen) => fen || null)

export const getSingleMatchStatus = createSelector([getSingleMatchStatusState], (status) => status)

export const getSingleMatchPlayerId = createSelector(
    [getSingleMatchPlayerIdState],
    (playerId) => playerId
)

export const getChallengeMatchData = createSelector([getChallengeMatchDataState], (data) => data)

export const getChallengeMatchId = createSelector([getChallengeMatchIdState], (matchId) => matchId)

export const getChallengeMatchStatus = createSelector(
    [getChallengeMatchStatusState],
    (status) => status
)

export const getChallengeMatchOpponentInfo = createSelector(
    [getChallengeMatchOpponentInfoState],
    (opponentInfo) => opponentInfo
)

export const getChallengeMatchWhitePlayerId = createSelector(
    [getChallengeMatchWhitePlayerIdState],
    (whitePlayerId) => whitePlayerId
)

export const getChallengeMatchBlackPlayerId = createSelector(
    [getChallengeMatchBlackPlayerIdState],
    (blackPlayerId) => blackPlayerId
)

export const getChallengeMatchOpponentId = createSelector(
    [getChallengeMatchData, getPlayerIdProps],
    (matchData, playerId) => {
        const { whitePlayerId, blackPlayerId } = matchData

        if (whitePlayerId !== playerId && blackPlayerId === playerId) return whitePlayerId

        if (blackPlayerId !== playerId && whitePlayerId === playerId) return blackPlayerId

        return ''
    }
)

export const getChallengeMatchPlayerId = createSelector(
    [getChallengeMatchData, getPlayerIdProps],
    (matchData, playerId) => {
        const { whitePlayerId, blackPlayerId } = matchData
        if (whitePlayerId === playerId) return whitePlayerId
        if (blackPlayerId === playerId) return blackPlayerId

        return SampleOpponent.playerId
    }
)

export const getIsPlayerFinishChallengeMatch = createSelector(
    [getChallengeMatchData, getPlayerIdProps],
    (matchData, playerId) => {
        const { whitePlayerId, blackPlayerId, whitePlayerFinish, blackPlayerFinish } = matchData
        if (playerId && whitePlayerId === playerId) return whitePlayerFinish

        if (playerId && blackPlayerId === playerId) return blackPlayerFinish

        return false
    }
)

export const getIsOpponentFinishChallengeMatch = createSelector(
    [getChallengeMatchData, getOpponentIdProps],
    (matchData, opponentId) => {
        const { whitePlayerId, blackPlayerId, whitePlayerFinish, blackPlayerFinish } = matchData
        if (opponentId && whitePlayerId === opponentId) return whitePlayerFinish

        if (opponentId && blackPlayerId === opponentId) return blackPlayerFinish

        return false
    }
)

export const getGroupMatchOpponentInfo = createSelector(
    [getGroupMatchOpponentInfoState],
    (opponentInfo) => opponentInfo
)

export const getOnlineMatchPlayers = createSelector(
    [getOnlineMatchPlayersState],
    (players) => players
)

export const getJourneyMatchData = createSelector([getJourneyMatchDataState], (data) => data)

export const getJourneyMatchId = createSelector([getJourneyMatchIdState], (matchId) => matchId)

export const getJourneyMatchLevel = createSelector([getJourneyMatchLevelState], (level) => level)

export const getJourneyChallengeMode = createSelector(
    [getJourneyChallengeModeState],
    (challengeMode) => challengeMode
)
export const getJourneyMatchScore = createSelector([getJourneyMatchScoreState], (score) => score)
