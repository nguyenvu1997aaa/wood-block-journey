import GoogleAnalytics from '@/analytics/GoogleAnalytics'
import { AnalyticsEvents } from '@/constants/Analytics'

import { SceneKeys } from '@/game/constants/scenes'

import { detectGameMode } from '@/redux/actions/context'
import { sendException, setSentryUser } from '@/utils/Sentry'

const BUILD_VERSION = import.meta.env.SNOWPACK_PUBLIC_BUILD_VERSION as string
const GA_MEASUREMENT_ID = import.meta.env.SNOWPACK_PUBLIC_GA_MEASUREMENT_ID as string
const UA_TRACKING_ID = import.meta.env.SNOWPACK_PUBLIC_UA_TRACKING_ID as string

class BootScene extends Phaser.Scene {
    public create(): void {
        this.facebook.progressLoading.loadingProgressFbBootScene()

        this.startGame()
    }

    private startGame = async () => {
        try {
            await this.auth.requestToken()

            await this.storage.syncStore()

            this.configureSentry()

            this.configureRollbar()

            await this.detectGameMode()

            // * Call after detectGameMode
            this.initGoogleAnalytics()

            this.analytics.event(AnalyticsEvents.LOAD_START)

            this.scene.launch(SceneKeys.GLOBAL_SCENE)

            // * after all, start loading scene
            this.scene.start(SceneKeys.LOAD_SCENE)

            this.analytics.pageview(SceneKeys.LOAD_SCENE)
        } catch (error) {
            sendException(error)
        } finally {
            this.facebook.progressLoading.finishLoadingProgressFbBootScene()

            this.scene.sleep(SceneKeys.BOOT_SCENE)
        }
    }

    private configureSentry(): void {
        const player = this.player.getPlayer()

        setSentryUser({
            id: player.playerId,
            username: player.name,
        })
    }

    private configureRollbar(): void {
        if (!this.rollbar) return

        const player = this.player.getPlayer()

        this.rollbar.configure({
            payload: {
                person: {
                    id: player.playerId,
                    name: player.name,
                },
            },
        })
    }

    private async detectGameMode(): Promise<void> {
        await this.storage.dispatch(detectGameMode())
    }

    private initGoogleAnalytics() {
        if (UA_TRACKING_ID != 'null' || GA_MEASUREMENT_ID != 'null') {
            const userId = this.player.getPlayerId()
            const version = BUILD_VERSION || '1.0.0'
            this.analytics.add(
                new GoogleAnalytics(this.game, {
                    userId,
                    trackingId: UA_TRACKING_ID,
                    measuringId: GA_MEASUREMENT_ID,
                    version,
                })
            )
        }
    }
}

export default BootScene
