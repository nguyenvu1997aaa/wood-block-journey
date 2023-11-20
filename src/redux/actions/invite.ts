import { AnalyticsEvents } from '@/constants/Analytics'
import { JOURNEY_INVITE } from '@/constants/ContextTypes'
import WideFrameRenderFail from '@/exceptions/WideFrameRenderFail'
import { ScreenKeys } from '@/game/constants/screens'
import { sendException } from '@/utils/Sentry'
import { renderWideframesBestScore, renderWideframesCurrentScore } from './share'

const validateImageRender = (imageShare: unknown) => {
    if (typeof imageShare !== 'string' || !imageShare) {
        throw new WideFrameRenderFail(null, { imageShare })
    }
}

/* 
  Invite with current score
*/
export const inviteWithCurrentScore = () => async (_: unused, getState: IGetSate) => {
    const { player, analytics, facebook, globalScene, lang } = window.game

    try {
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        const state = getState()
        const imageShare = await renderWideframesCurrentScore(state)

        validateImageRender(imageShare)

        const { playerId, name: playerName, photo: playerPhoto } = player.getPlayer()

        await facebook.inviteAsync({
            template: JOURNEY_INVITE,

            cta: {
                default: 'Play',
                localizations: {
                    en_US: 'Play',
                    vi_VN: 'Chơi ngay',
                },
            },
            text: {
                default: `Easy! I have a new score!`,
                localizations: {
                    en_US: `Easy! I have a new score!`,
                    vi_VN: `A ha! Mình vừa đạt một điểm mới!`,
                },
            },
            image: imageShare || '',
            data: { playerId, playerName, playerPhoto, type: JOURNEY_INVITE },
        })

        analytics.event(AnalyticsEvents.INVITE, {
            invite_content_type: 'CurrentScore',
            success: true,
        })
    } catch (error) {
        analytics.event(AnalyticsEvents.INVITE, {
            invite_content_type: 'CurrentScore',
            success: false,
        })

        sendException(error)
    } finally {
        globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }
}

/* 
  Invite with best score
*/
export const inviteWithBestScore = () => async () => {
    const { player, analytics, facebook, globalScene, lang } = window.game

    try {
        globalScene.screen.open(ScreenKeys.NOTIFY_SCREEN, {
            message: lang.Text.LOADING,
            loading: true,
        })

        const imageShare = await renderWideframesBestScore()

        validateImageRender(imageShare)

        const { playerId, name: playerName, photo: playerPhoto } = player.getPlayer()

        await facebook.inviteAsync({
            template: JOURNEY_INVITE,

            cta: {
                default: 'Play',
                localizations: {
                    en_US: 'Play',
                    vi_VN: 'Chơi ngay',
                },
            },
            text: {
                default: `Great! I have a best score!`,
                localizations: {
                    en_US: `Great! I have a best score!`,
                    vi_VN: `Thật tuyệt! Mình vừa phá kỷ lục này!`,
                },
            },
            image: imageShare || '',
            data: { playerId, playerName, playerPhoto, type: JOURNEY_INVITE },
        })

        analytics.event(AnalyticsEvents.INVITE, { invite_content_type: 'BestScore', success: true })
    } catch (error) {
        analytics.event(AnalyticsEvents.INVITE, {
            invite_content_type: 'BestScore',
            success: false,
        })

        sendException(error)
    } finally {
        globalScene.screen.close(ScreenKeys.NOTIFY_SCREEN)
    }
}
