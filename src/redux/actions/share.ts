import { AnalyticsEvents } from '@/constants/Analytics'
import { SHARE_INVITE } from '@/constants/ContextTypes'
import WideFrameRenderFail from '@/exceptions/WideFrameRenderFail'
import IMAGES from '@/game/constants/resources/images'
import { ScreenKeys } from '@/game/constants/screens'
import { getConnectedPlayerEntriesAsync } from '@/modules/leader-boards/api/leaderboards'
import {
    getChallengeMatchOpponentInfo,
    getGroupMatchOpponentInfo,
    getIsOpponentFinishChallengeMatch,
    getIsPlayerFinishChallengeMatch,
} from '@/modules/match/selectors/match'
import { getGameplayCurrentStats, getGameplayStats } from '@/modules/match/selectors/stats'
import { sendException } from '@/utils/Sentry'

const validateImageRender = (imageShare: unknown) => {
    if (typeof imageShare !== 'string' || !imageShare) {
        throw new WideFrameRenderFail(null, { imageShare })
    }
}

/* 
  Share best score
*/
export const shareBestScore = () => async () => {
    const { player, analytics, facebook, globalScene, lang } = window.game

    try {
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        const imageShare = await renderWideframesBestScore()

        validateImageRender(imageShare)

        const { playerId, name: playerName, photo: playerPhoto } = player.getPlayer()

        await facebook.shareAsync({
            text: lang.Text.SHARE_BEST_SCORE,
            intent: 'SHARE',
            image: imageShare || '',
            data: { playerId, playerName, playerPhoto, type: SHARE_INVITE },
        })

        analytics.event(AnalyticsEvents.SHARE, { share_content_type: 'BestScore', success: true })
    } catch (error) {
        analytics.event(AnalyticsEvents.SHARE, { share_content_type: 'BestScore', success: false })

        sendException(error)
    } finally {
        globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }
}

export const renderWideframesBestScore = async () => {
    const { player, globalScene } = window.game

    const { playerId, photo: playerPhoto, data } = player.getPlayer()
    const { score: playerScore } = data || {}

    const renderOptions = getRenderOptionsBestScore({
        playerId,
        playerPhoto,
        playerScore,
    })

    if (!renderOptions) {
        console.warn('getRenderOptionsBestScore')
        return
    }

    const payload = {
        name: 'share-best-score',
        width: 952,
        height: 492,
        renderOptions,
    }

    return await globalScene.frameCapture.capture(payload)
}

export const renderWideframesCurrentScore = async (state: IState) => {
    const { player, globalScene } = window.game

    const currentStats = getGameplayCurrentStats(state)
    const dataStats = getGameplayStats(state)

    const { playerId, photo: playerPhoto } = player.getPlayer()
    let { score: playerScore } = dataStats[playerId] || {}

    if (currentStats.bestScore > playerScore) {
        playerScore = currentStats.bestScore
    }

    const renderOptions = getRenderOptionsBestScore({
        playerId,
        playerPhoto,
        playerScore,
    })

    if (!renderOptions) {
        console.warn('getRenderOptionsCurrentScore')
        return
    }

    const payload = {
        name: 'share-current-score',
        width: 952,
        height: 492,
        renderOptions,
    }

    return await globalScene.frameCapture.capture(payload)
}

const getRenderOptionsBestScore = (data: TObject): IWideFrameRenderOptions | null => {
    const { playerId = '10', playerPhoto = '', playerScore = 0 } = data

    if (typeof playerId !== 'string') return null
    if (typeof playerPhoto !== 'string') return null
    if (typeof playerScore !== 'number') return null

    const renderOptions: IWideFrameRenderOptions = {
        avatar: {
            name: `${playerId}`,
            type: 'image',
            x: 635,
            y: 122,
            image: playerPhoto,
            width: 210,
            height: 210,
            fallbackWithImage: IMAGES.AVATAR.KEY,
        },

        wideFrame: {
            name: 'wide-frame-message-win',
            type: 'image',
            x: 0,
            y: 0,
            image: './assets/wideframes/wide-frame-message-win.png',
            width: 952,
            height: 492,
        },

        playerScoreShadow: {
            type: 'text',
            x: 740,
            y: 437,
            font: '600 70px',
            fillStyle: '#c4683f',
            text: `${playerScore}`,
            textAlign: 'center',
        },

        playerScore: {
            type: 'text',
            x: 740,
            y: 437,
            font: '600 70px',
            fillStyle: '#f2a62e',
            text: `${playerScore}`,
            textAlign: 'center',
        },
    }

    return renderOptions
}

/* 
  Share leaderboard
*/
export const shareLeaderboards = () => async () => {
    const { player, analytics, facebook, globalScene, lang } = window.game

    try {
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        const imageShare = await renderWideframesLeaderboard()

        validateImageRender(imageShare)

        const { playerId, name: playerName, photo: playerPhoto } = player.getPlayer()

        await facebook.shareAsync({
            text: lang.Text.SHARE_LEADERBOARDS,
            intent: 'CHALLENGE',
            image: imageShare || '',
            data: { playerId, playerName, playerPhoto, type: SHARE_INVITE },
        })

        analytics.event(AnalyticsEvents.SHARE, {
            share_content_type: 'Leaderboard',
            success: true,
        })
    } catch (error) {
        analytics.event(AnalyticsEvents.SHARE, {
            share_content_type: 'Leaderboard',
            success: false,
        })

        sendException(error)
    } finally {
        globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }
}

const renderWideframesLeaderboard = async () => {
    const { player, profile, globalScene } = window.game

    const { playerId, name: playerName, photo: playerPhoto } = player.getPlayer()

    const playerIds = player.getConnectedPlayerIds(99, 0)

    playerIds.push(playerId)

    const listLeaders: (typeof defaultStats)[] = []

    const entries = (await getConnectedPlayerEntriesAsync({
        playerIds: GameCore.Utils.Array.unique(playerIds),
        limit: playerIds.length,
    })) as TObject[]

    const entriesStats = GameCore.Utils.Object.keyBy(entries, 'playerId')

    const defaultStats = {
        playerId,
        name: playerName,
        photo: playerPhoto,
        score: 0,
    }

    let playerStats = defaultStats
    if (GameCore.Utils.Object.hasOwn(entriesStats, playerId)) {
        playerStats = entriesStats[playerId] as typeof defaultStats
    }

    listLeaders.push(playerStats)

    for (const leaderId in entriesStats) {
        if (GameCore.Utils.Object.hasOwn(entriesStats, leaderId)) {
            const leader = entriesStats[leaderId] as typeof defaultStats

            if (listLeaders.length === 3) break
            if (leader.playerId === playerId) continue
            if (Number(leader.score) > Number(playerStats.score)) continue

            listLeaders.push(leader)
        }
    }

    const needPlayerIds = GameCore.Utils.Array.unique(playerIds)

    await profile.requestProfiles(needPlayerIds)

    const profiles = profile.getProfiles()

    listLeaders.forEach((leader, index) => {
        const { playerId } = leader

        if (!GameCore.Utils.Object.hasOwn(profiles, playerId)) return
        const { name, photo } = profiles[playerId]

        listLeaders[index].name = name
        listLeaders[index].photo = photo
    })

    if (listLeaders.length < 3) {
        let i = 0
        while (i <= 3 - listLeaders.length) {
            listLeaders.push({
                playerId: 'bot' + i,
                name: '???',
                score: 0,
                photo: './assets/images/others/avatar.png',
            })
            i++
        }
    }

    const renderOptions = getRenderOptionsLeaderboard({
        playerId,
        playerName,
        playerPhoto,
        listLeaders,
    })

    if (!renderOptions) {
        console.warn('getRenderOptionsLeaderboard')
        return
    }

    const payload = {
        name: 'share-leaderboard',
        width: 1500,
        height: 2000,
        renderOptions,
    }

    return await globalScene.frameCapture.capture(payload)
}

const getRenderOptionsLeaderboard = (data: TObject): IWideFrameRenderOptions | null => {
    const { playerId = '10', playerPhoto = '', listLeaders = [] } = data

    if (!Array.isArray(listLeaders)) return null
    if (typeof playerId !== 'string') return null
    if (typeof playerPhoto !== 'string') return null

    const renderOptions: IWideFrameRenderOptions = {
        avatar: {
            name: `${playerId}`,
            type: 'image',
            x: 490,
            y: 250,
            image: playerPhoto,
            width: 525,
            height: 525,
            fallbackWithImage: IMAGES.AVATAR.KEY,
        },
    }

    listLeaders.forEach((leader, index) => {
        const { playerId, photo } = leader

        renderOptions[`photo_${playerId}`] = {
            name: `${playerId}`,
            type: 'image',
            x: 475,
            y: 1215 + 385 * index,
            image: photo,
            width: 150,
            height: 150,
            fallbackWithImage: IMAGES.AVATAR.KEY,
        }
    })

    renderOptions['wideFrame'] = {
        name: 'wide-frame-share',
        type: 'image',
        x: 0,
        y: 0,
        image: './assets/wideframes/wide-frame-share.png',
        width: 1500,
        height: 2000,
    }

    listLeaders.forEach((leader, index) => {
        const { playerId, name, score } = leader

        renderOptions[`name_${playerId}`] = {
            type: 'text',
            x: 690,
            y: 1312 + 193 * index,
            font: `600 ${60}px`,
            text: name,
            fillStyle: '#b18151',
        }

        renderOptions[`score_${playerId}`] = {
            type: 'text',
            x: 1070,
            y: 1312 + 193 * index,
            font: `600 ${55}px`,
            text: score,
            fillStyle: '#b18151',
        }
    })

    return renderOptions
}

/* 
  Share game result
*/
export const shareGameResult = () => async (_: unused, getState: IGetSate) => {
    const { player, analytics, facebook, globalScene, lang } = window.game

    try {
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        const state = getState()
        const imageShare = await renderWideframesGameResult(state)

        console.log('imageShare === ', imageShare)

        validateImageRender(imageShare)

        const { playerId, name: playerName, photo: playerPhoto } = player.getPlayer()

        await facebook.shareAsync({
            text: lang.Text.SHARE_GAME_RESULTS,
            intent: 'SHARE',
            image: imageShare || '',
            data: { playerId, playerName, playerPhoto, type: SHARE_INVITE },
        })

        analytics.event(AnalyticsEvents.SHARE, {
            share_content_type: 'MatchResult',
            success: true,
        })
    } catch (error) {
        analytics.event(AnalyticsEvents.SHARE, {
            share_content_type: 'MatchResult',
            success: false,
        })

        sendException(error)
    } finally {
        globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }
}

export const renderWideframesGameResult = async (state: IState) => {
    const { player, globalScene } = window.game

    const dataStats = getGameplayStats(state)

    const { photo: playerPhoto, playerId } = player.getPlayer()
    const { playerId: opponentId, photo: opponentPhoto } = getChallengeMatchOpponentInfo(state)

    //@ts-ignore
    const isPlayerFinished = getIsPlayerFinishChallengeMatch(state, { playerId })
    //@ts-ignore
    const isOpponentFinished = getIsOpponentFinishChallengeMatch(state, { opponentId })

    const { score: playerScore } = dataStats[playerId] || {}
    const { score: opponentScore } = dataStats[opponentId] || {}

    const renderOptions = getRenderOptionsGameResult({
        playerId,
        playerPhoto,
        playerScore,
        opponentId,
        opponentPhoto,
        opponentScore,
        isPlayerFinished,
        isOpponentFinished,
    })

    if (!renderOptions) {
        console.warn('getRenderOptionsLeaderboard')
        return
    }

    const payload = {
        name: 'share-game-result',
        width: 952,
        height: 492,
        renderOptions,
    }

    return await globalScene.frameCapture.capture(payload)
}

export const renderWideframesGroupMatchResult = async (state: IState) => {
    const { player, globalScene } = window.game

    const dataStats = getGameplayStats(state)

    const { photo: playerPhoto, playerId } = player.getPlayer()
    const {
        playerId: opponentId,
        photo: opponentPhoto,
        score: opponentScore,
    } = getGroupMatchOpponentInfo(state)

    const { score: playerScore } = dataStats[playerId] || {}

    const renderOptions = getRenderOptionsGameResult({
        playerId,
        playerPhoto,
        playerScore,
        opponentId,
        opponentPhoto,
        opponentScore,
    })

    if (!renderOptions) {
        console.warn('getRenderOptionsGroupResult')
        return
    }

    const payload = {
        name: 'share-group-match-result',
        width: 952,
        height: 492,
        renderOptions,
    }

    return await globalScene.frameCapture.capture(payload)
}

const getRenderOptionsGameResult = (data: TObject): IWideFrameRenderOptions | null => {
    const {
        playerId = '10',
        playerPhoto = '',
        playerScore = 0,
        opponentId = '20',
        opponentPhoto = '',
        opponentScore = 0,
        isPlayerFinished,
        isOpponentFinished,
    } = data

    if (typeof playerId !== 'string') return null
    if (typeof playerPhoto !== 'string') return null
    if (typeof playerScore !== 'number') return null
    if (typeof opponentId !== 'string') return null
    if (typeof opponentPhoto !== 'string') return null
    if (typeof opponentScore !== 'number') return null
    if (typeof isPlayerFinished !== 'boolean') return null
    if (typeof isOpponentFinished !== 'boolean') return null

    const isDraw = playerScore === opponentScore
    const isPlayerWin = playerScore > opponentScore
    const isGameWaiting = isPlayerFinished || isOpponentFinished
    const isGameFinished = isPlayerFinished && isOpponentFinished

    const renderOptions: IWideFrameRenderOptions = {
        leftPhoto: {
            name: `${playerId}`,
            type: 'image',
            x: 55,
            y: 162,
            image: playerPhoto,
            width: 200,
            height: 200,
            fallbackWithImage: IMAGES.AVATAR.KEY,
        },

        rightPhoto: {
            name: `${opponentId}`,
            type: 'image',
            x: 702,
            y: 162,
            image: opponentPhoto,
            width: 200,
            height: 200,
            fallbackWithImage: IMAGES.AVATAR.KEY,
        },

        wideFrame: {
            name: 'wide-frame-game-result',
            type: 'image',
            x: 0,
            y: 0,
            image: './assets/wideframes/wide-frame-game-result.png',
            width: 952,
            height: 492,
        },
    }

    // Only show score when match started
    if (isGameWaiting) {
        renderOptions['leftScoreShadow'] = {
            type: 'text',
            x: 148,
            y: 443,
            font: `600 ${70}px`,
            fillStyle: '#c4683f',
            text: isPlayerFinished ? `${playerScore}` : '???',
            textAlign: 'center',
        }

        renderOptions['leftScore'] = {
            type: 'text',
            x: 148,
            y: 443,
            font: `600 ${70}px`,
            fillStyle: '#f2a62e',
            text: isPlayerFinished ? `${playerScore}` : '???',
            textAlign: 'center',
        }

        renderOptions['rightScoreShadow'] = {
            type: 'text',
            x: 795,
            y: 443,
            font: `600 ${70}px`,
            fillStyle: '#c4683f',
            text: isOpponentFinished ? `${opponentScore}` : '???',
            textAlign: 'center',
        }

        renderOptions['rightScore'] = {
            type: 'text',
            x: 795,
            y: 443,
            font: `600 ${70}px`,
            fillStyle: '#f2a62e',
            text: isOpponentFinished ? `${opponentScore}` : '???',
            textAlign: 'center',
        }
    }

    // Only show crown icon when match finished and not draw
    if (!isDraw && isGameFinished) {
        if (isPlayerWin) {
            renderOptions['leftCrown'] = {
                name: 'crown-icon',
                type: 'image',
                x: 12,
                y: 122,
                image: './assets/images/others/crown-icon.png',
                width: 106,
                height: 78,
            }
        } else {
            renderOptions['rightCrown'] = {
                name: 'crown-icon',
                type: 'image',
                x: 665,
                y: 122,
                image: './assets/images/others/crown-icon.png',
                width: 106,
                height: 78,
            }
        }
    }

    return renderOptions
}

/* 
  Share score
*/
export const shareScore = () => async (_: unused) => {
    const { player, analytics, facebook, globalScene, lang } = window.game

    try {
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        const imageShare = await renderWideframesScore()

        validateImageRender(imageShare)

        const { playerId, name: playerName, photo: playerPhoto } = player.getPlayer()

        await facebook.shareAsync({
            text: 'Great! I have a score!',
            intent: 'SHARE',
            image: imageShare || '',
            data: { playerId, playerName, playerPhoto, type: SHARE_INVITE },
        })

        analytics.event(AnalyticsEvents.SHARE, {
            share_content_type: 'Score',
            success: true,
        })
    } catch (error) {
        analytics.event(AnalyticsEvents.SHARE, {
            share_content_type: 'Score',
            success: false,
        })

        sendException(error)
    } finally {
        globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }
}

export const renderWideframesScore = async () => {
    const { player, globalScene } = window.game

    const { playerId, photo: playerPhoto } = player.getPlayer()
    const playerScore = player.getBestScore()

    const renderOptions = getRenderOptionsScore({
        playerId,
        playerPhoto,
        playerScore,
    })

    if (!renderOptions) {
        console.warn('getRenderOptionsBestScore')
        return
    }

    const payload = {
        name: 'share-score',
        width: 952,
        height: 492,
        renderOptions,
    }

    return await globalScene.frameCapture.capture(payload)
}

const getRenderOptionsScore = (data: TObject): IWideFrameRenderOptions | null => {
    const { playerId = '10', playerPhoto = '', playerScore = 0 } = data

    if (typeof playerId !== 'string') return null
    if (typeof playerPhoto !== 'string') return null
    if (typeof playerScore !== 'number') return null

    const renderOptions: IWideFrameRenderOptions = {
        avatar: {
            name: `${playerId}`,
            type: 'image',
            x: 635,
            y: 122,
            image: playerPhoto,
            width: 210,
            height: 210,
            fallbackWithImage: IMAGES.AVATAR.KEY,
        },

        wideFrame: {
            name: 'wide-frame-message-win',
            type: 'image',
            x: 0,
            y: 0,
            image: './assets/wideframes/wide-frame-message-win.png',
            width: 952,
            height: 492,
        },

        playerScoreShadow: {
            type: 'text',
            x: 740,
            y: 437,
            font: '600 70px',
            fillStyle: '#c4683f',
            text: `${playerScore}`,
            textAlign: 'center',
        },

        playerScore: {
            type: 'text',
            x: 740,
            y: 437,
            font: '600 70px',
            fillStyle: '#f2a62e',
            text: `${playerScore}`,
            textAlign: 'center',
        },
    }

    return renderOptions
}
