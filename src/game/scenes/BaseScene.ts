import { AnalyticsEvents } from '@/constants/Analytics'
import GameZone from '@/game/components/GameZone'
import WORLD_EVENTS from '@/plugins/world/constants/events'
import FPS from '../constants/fps'
import { SceneKeys } from '../constants/scenes'

abstract class BaseScene extends Phaser.Scene {
    protected unsubscribeList: Function[]

    public gameZone: Phaser.GameObjects.Zone
    public background: Phaser.GameObjects.Image

    private handleOpenScene = () => {
        this.logPageviewOnOpen()
        this.logEventOpen()
        this.scaleGame()
    }

    private handleResize = () => {
        if (!this.background || !this.gameZone) return

        const { width, height } = this.world.getWorldSize()

        this.gameZone.setSize(width, height)
        this.background.setPosition(width / 2, height / 2)
        this.background.setDisplaySize(width, height)
    }

    constructor() {
        super({ visible: false })
    }

    public create(): void {
        this.events.on('wake', this.handleOpenScene)
        this.events.on('resume', this.handleOpenScene)
        this.events.on('create', this.handleOpenScene)

        this.world.events.on(WORLD_EVENTS.RESIZE, this.handleResize)

        this.scaleGame()
        this.createGameZone()

        const { Game } = GameCore.Configs
        this.events.on(Phaser.Scenes.Events.UPDATE, () => {
            if (!Game.AutoDropFps) return

            this.autoUpdateFPS()
        })
    }

    protected scaleGame(): void {
        const camera = this.getCamera('main')

        const zoomRatio = this.world.getZoomRatio()
        const { width, height } = this.world.getWorldSize()

        camera.setZoom(zoomRatio)
        camera.centerOn(width / 2, height / 2)
    }

    private createGameZone(): void {
        const { width, height } = this.world.getWorldSize()
        this.gameZone = new GameZone(this, width, height)
    }

    private autoUpdateFPS() {
        if (!this.allowUpdateFPS()) return

        if (!this.tweenPlaying() && !this.particlePlaying()) {
            this.game.updateFps(FPS.min)
        } else {
            this.game.updateFps(FPS.max)
        }
    }

    private allowUpdateFPS() {
        if (this.scene.key !== SceneKeys.GAME_SCENE && this.scene.key !== SceneKeys.JOURNEY_SCENE)
            return false

        return true
    }

    private tweenPlaying() {
        const allTween = this.tweens.getAllTweens()
        for (let i = 0; i < allTween.length; i++) {
            if (allTween[i].isPlaying()) {
                return true
            }
        }
        return false
    }

    private particlePlaying() {
        const particles = this.getAllParticles()

        if (!particles) return true

        let result = false

        particles.forEach((p: any) => {
            const emitters = p.emitters.list

            emitters.forEach((e: any) => {
                if (e.alive && e.alive.length > 0) {
                    result = true
                    return
                }
            })

            if (result) return
        })

        return result
    }

    private getAllParticles() {
        if (!this.input.enabled || !this.scene.isActive() || this.scene.isPaused()) return

        const children = this.children.list

        if (!children || children.length <= 0) return []

        const particles = children.filter((item) => {
            return item.type === 'ParticleEmitterManager'
        })

        return particles
    }

    private getCamera(name: string): Phaser.Cameras.Scene2D.Camera {
        if (name === 'main') return this.cameras.main
        return this.cameras.getCamera(name)
    }

    protected createMask(alpha = 1): void {
        const camera = this.getCamera('main')
        camera.setBackgroundColor(`rgba(0, 0, 0, ${alpha})`)
    }

    public fontSize(size: number): number {
        // ? modSize is number modify for the font size, after update new font
        const modSize = 2.4

        return size / modSize
    }

    protected createBackground(key: string, frame?: string, alpha?: number, tint?: number) {
        try {
            if (this.background) {
                this.background.setTexture(key)
                frame && this.background.setFrame(frame)
            } else {
                this.background = this.make.image({ key, frame })
            }

            this.background.setName(key)

            const { displayWidth, displayHeight } = this.gameZone
            this.background.setDisplaySize(displayWidth, displayHeight)

            if (GameCore.Utils.Valid.isNumber(alpha)) {
                this.background.setAlpha(alpha)
            }

            if (GameCore.Utils.Valid.isNumber(tint)) {
                this.background.setTint(tint)
            }

            Phaser.Display.Align.In.Center(this.background, this.gameZone)
        } catch (ex) {
            console.log('Ex === ', ex)
        }
    }

    protected handleStateChange(mapStateToCallback: SceneStateChange[]): void {
        this.unsubscribeList = []

        mapStateToCallback.forEach((payload) => {
            const { selector, callback } = payload
            const unsubscribe = this.storage.watch(selector, callback)
            this.unsubscribeList.push(unsubscribe)
        })

        this.events.once('sleep', this.removeStateChange)
        this.events.once('destroy', this.removeStateChange)
        this.events.once('shutdown', this.removeStateChange)
    }

    protected removeStateChange = (): void => {
        this.unsubscribeList.forEach((unsubscribe) => unsubscribe())
    }

    protected logPageviewOnOpen() {
        this.analytics.pageview(this.scene.key)
    }

    protected logEventOpen() {
        this.analytics.event(AnalyticsEvents.SCREEN_OPEN, {
            screen_name: this.getSceneName(),
        })
    }

    public getSceneName() {
        return GameCore.Utils.String.toUpperCamelCase(this.scene.key.toLowerCase())
    }
}

export default BaseScene
