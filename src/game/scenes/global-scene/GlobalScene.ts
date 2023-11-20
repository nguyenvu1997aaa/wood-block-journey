import FadeInAnimation from '@/game/animations/entrances/FadeIn'
import FadeOutAnimation from '@/game/animations/exits/FadeOut'
import SPRITES from '@/game/constants/resources/sprites'
import { SceneEvents, SceneKeys } from '@/game/constants/scenes'
import { ScreenKeys } from '@/game/constants/screens'
import { updateActiveSceneKey } from '@/redux/actions/scene'
import { getCurrentSceneKey } from '@/redux/selectors/scene'
import { addBreadcrumbSentry } from '@/utils/Sentry'
import BaseScene from '../BaseScene'
import FpsMeter from './common/FpsMeter'
import MemoryMeter from './common/MemoryMeter'
import AlertScreen from './screens/AlertScreen'
import NotifyScreen from './screens/NotifyScreen'

const { KEY, FRAME } = SPRITES.DEFAULT

class GlobalScene extends BaseScene {
    private mask: Phaser.GameObjects.Image

    private fadeInAnim: FadeInAnimation
    private fadeOutAnim: FadeOutAnimation

    private fpsMeter: FpsMeter
    private memoryMeter: MemoryMeter

    public init(): void {
        this.listenScenesEvents()

        // * Inject global scene to Game
        // ? Make a simpler call
        this.game.globalScene = this
    }

    public setup(): void {
        this.scaleGame()

        this.addMask()

        this.addNotifyScreen()
        this.addAlertScreen()

        this.addFPS()
        this.addMemory()
    }

    private addNotifyScreen(): void {
        const screen = this.screen.add(ScreenKeys.NOTIFY_SCREEN, NotifyScreen)
        Phaser.Display.Align.In.Center(screen, this.gameZone)
    }

    private addAlertScreen(): void {
        const screen = this.screen.add(ScreenKeys.ALERT_SCREEN, AlertScreen)
        Phaser.Display.Align.In.Center(screen, this.gameZone)
    }

    private addMask() {
        this.mask = this.make.image({
            key: KEY,
            frame: FRAME.BLANK,
        })

        const { width, height } = this.gameZone

        this.mask.setAlpha(0)
        this.mask.setOrigin(0, 0)
        this.mask.setTint(0x000000)
        this.mask.setWorldSize(width, height)
    }

    private addFPS(): void {
        const { ShowFPSInGame } = GameCore.Configs.Statistics
        if (!ShowFPSInGame) return

        this.fpsMeter = new FpsMeter(this)

        Phaser.Display.Align.In.TopLeft(this.fpsMeter, this.gameZone, -20, -10)
    }

    private addMemory(): void {
        const { ShowMemoryInGame } = GameCore.Configs.Statistics
        if (!ShowMemoryInGame) return

        this.memoryMeter = new MemoryMeter(this)

        Phaser.Display.Align.In.TopLeft(this.memoryMeter, this.gameZone, -45, -3)
    }

    private updateSceneState(): void {
        // ? Global Scene alway on top of scenes list
        this.setGlobalSceneOnTop()
    }

    private setGlobalSceneOnTop() {
        this.scene.bringToTop(this)
    }

    private runMaskFadeInAnimation() {
        return
        if (!this.mask) return
        if (!GameCore.Configs.EnableEffectSceneTransition) return

        this.fadeInAnim?.remove()
        this.fadeOutAnim?.remove()

        this.fadeInAnim = new FadeInAnimation({
            targets: [this.mask],
            duration: 400,
            ease: Phaser.Math.Easing.Cubic.In,
            props: {
                alpha: { start: 0, from: 0, to: 0.6 },
            },
        })

        this.mask.setAlpha(0)
        this.fadeInAnim.play()
    }

    private runMaskFadeOutAnimation() {
        return
        if (!this.mask) return
        if (!GameCore.Configs.EnableEffectSceneTransition) return

        this.fadeInAnim?.remove()
        this.fadeOutAnim?.remove()

        this.fadeOutAnim = new FadeOutAnimation({
            targets: [this.mask],
            duration: 400,
            ease: Phaser.Math.Easing.Cubic.Out,
            props: {
                alpha: { start: 0.6, from: 0.6, to: 0 },
            },
        })

        this.mask.setAlpha(1)
        this.fadeOutAnim.play()
    }

    private listenScenesEvents(): void {
        const scenes = this.scene.manager.getScenes(false)

        // Listen scenes manager events
        scenes.forEach((scene) => {
            scene.events.on(Phaser.Scenes.Events.CREATE, this.emitGameEventStartScene)
            scene.events.on(Phaser.Scenes.Events.SLEEP, this.emitGameEventSleepScene)
            scene.events.on(Phaser.Scenes.Events.WAKE, this.emitGameEventWakeScene)
            scene.events.on(Phaser.Scenes.Events.PAUSE, this.emitGameEventPauseScene)
            scene.events.on(Phaser.Scenes.Events.RESUME, this.emitGameEventResumeScene)
            scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.emitGameEventShutdownScene)
        })

        // Listen scene events from GlobalScene
        this.events.on(SceneEvents.SWITCH, this.switchScene)
        this.events.on(SceneEvents.RUN, this.runScene)
    }

    private getActiveScene(): Phaser.Scene {
        const scenes = this.scene.manager.getScenes(true)
        return scenes[0]
    }

    public getCurrentScene(): Phaser.Scenes.ScenePlugin {
        return this.currentScene
    }

    private get currentScene(): Phaser.Scenes.ScenePlugin {
        const state = this.storage.getState()
        const activeSceneKey = getCurrentSceneKey(state)

        let scene
        if (activeSceneKey) {
            scene = this.scene.manager.getScene(activeSceneKey)
        } else {
            scene = this.getActiveScene()
        }

        return scene.scene
    }

    private switchScene = (key: string): void => {
        if (this.currentScene.key === key) return
        this.currentScene.switch(key)
    }

    private runScene = (key: string): void => {
        this.currentScene.run(key)
    }

    private updateActiveSceneKey(key: string): void {
        if (key === SceneKeys.GLOBAL_SCENE) return

        // Update active scene key to redux
        this.storage.dispatch(updateActiveSceneKey(key))
    }

    private emitGameEventStartScene = (scene: Phaser.Scene) => {
        const { key } = scene.scene
        console.info('%cScene start', 'color: #D27D2D', key)

        this.updateSceneState()
        this.runMaskFadeOutAnimation()

        this.updateActiveSceneKey(key)

        this.game.events.emit(Phaser.Scenes.Events.START, key)

        // ? Debug data for Sentry
        addBreadcrumbSentry('scene', `Start scene: ${key}`)
    }

    private emitGameEventSleepScene = (scene: Phaser.Scenes.ScenePlugin) => {
        const { key } = scene.scene.scene
        console.info('%cScene sleep', 'color: #D27D2D', key)

        if (key === SceneKeys.LOAD_SCENE) return

        this.runMaskFadeInAnimation()

        this.game.events.emit(Phaser.Scenes.Events.SLEEP, key)
    }

    private emitGameEventWakeScene = (scene: Phaser.Scenes.ScenePlugin) => {
        const { key } = scene.scene.scene
        console.info('%cScene wake', 'color: #D27D2D', key)

        if (key === SceneKeys.LOAD_SCENE) return

        this.updateSceneState()
        this.runMaskFadeOutAnimation()

        this.updateActiveSceneKey(key)

        this.game.events.emit(Phaser.Scenes.Events.WAKE, key)
    }

    private emitGameEventPauseScene = (scene: Phaser.Scenes.ScenePlugin) => {
        const { key } = scene.scene.scene
        console.info('%cScene pause', 'color: #D27D2D', key)
        this.game.events.emit(Phaser.Scenes.Events.PAUSE, key)
    }

    private emitGameEventResumeScene = (scene: Phaser.Scene) => {
        const { key } = scene.scene
        console.info('%cScene resume', 'color: #D27D2D', key)
        this.game.events.emit(Phaser.Scenes.Events.RESUME, key)
    }

    private emitGameEventShutdownScene = (scene: Phaser.Scenes.ScenePlugin) => {
        const { key } = scene.scene.scene
        console.info('%cScene shutdown', 'color: #D27D2D', key)
        this.game.events.emit(Phaser.Scenes.Events.SHUTDOWN, key)
    }

    protected logEventOpen() {
        //? no log event open for global scene
    }

    protected logPageviewOnOpen() {
        //? no log page view for global scene
    }
}

export default GlobalScene
