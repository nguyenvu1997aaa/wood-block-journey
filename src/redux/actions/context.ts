import {
    CONTEXT_GAME_MODE_DETECTED,
    CONTEXT_PROCESSED,
    CONTEXT_RECEIVED,
} from '@/constants/ActionTypes'
import {
    CHALLENGE_FRIEND_MATCH,
    MATCHING_GROUP_MATCH,
    SHARE_INVITE,
} from '@/constants/ContextTypes'
import { SampleOpponent } from '@/constants/SampleOpponent'
import {
    MATCH_MODE_CHALLENGE_FRIENDS,
    MATCH_MODE_MATCHING_GROUP,
    MATCH_MODE_SINGLE,
    MATCH_MODE_TOURNAMENTS,
} from '@/modules/match/constants/GameModes'
import { addBreadcrumbSentry } from '@/utils/Sentry'
import { getContext } from '../selectors/context'

export const contextReceived = (
    contextId: string | null,
    contextType: string,
    entryPointData: TObject
) => ({
    type: CONTEXT_RECEIVED,
    payload: { contextId, contextType, entryPointData },
})

export const contextProcessed = (contextId: string, contextType: string) => ({
    type: CONTEXT_PROCESSED,
    payload: { contextId, contextType },
})

export const detectGameMode =
    () =>
    async (dispatch: IDispatch, getState: IGetSate): Promise<void> => {
        const state = getState()
        const context = getContext(state)

        const { player } = window.game

        const currentPlayerId = player.getPlayerId()

        const { contextId, entryPointData } = context

        const {
            type,
            matchId,
            playerId,
            opponentId = SampleOpponent.playerId,
        } = entryPointData || {}

        // ! Player from entryPointData
        // ex: PlayerA invite PlayerB -> playerId is PlayerA
        // ex: PlayerB join from post/message of PlayerB -> opponentId is PlayerB
        // ? ->  in this case, opponentId maybe is "10" (is new friend), so currentPlayerId is PlayerB and playerB has id "10" in context

        const isPlayer = currentPlayerId === playerId
        const isNewFriend = opponentId === SampleOpponent.playerId
        const isOwnerContext = isNewFriend || [opponentId, playerId].includes(currentPlayerId)

        let gamemode = MATCH_MODE_SINGLE

        // Context from tournament
        try {
            await window.game.facebook.getTournamentAsync()
            gamemode = MATCH_MODE_TOURNAMENTS
        } catch {
            //
        }

        // Context from post
        if (contextId && type === SHARE_INVITE && !isPlayer) {
            gamemode = MATCH_MODE_CHALLENGE_FRIENDS
        }

        // Context from message
        if (matchId && contextId && isOwnerContext && type === CHALLENGE_FRIEND_MATCH) {
            gamemode = MATCH_MODE_CHALLENGE_FRIENDS
        }

        // Process context from matching group
        if (contextId && type === MATCHING_GROUP_MATCH) {
            gamemode = MATCH_MODE_MATCHING_GROUP
        }

        dispatch(gameModeDetected(gamemode))
    }

export const gameModeDetected = (gameMode: string) => (dispatch: IDispatch) => {
    dispatch({
        type: CONTEXT_GAME_MODE_DETECTED,
        payload: { gameMode },
    })

    // ? Debug data for Sentry
    addBreadcrumbSentry('game-mode', gameMode)
}
