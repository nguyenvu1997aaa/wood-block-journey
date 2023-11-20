import { debounce } from 'ts-debounce'
import WorldEvent from './common/Event'
import WORLD_EVENTS from './constants/events'

class WorldManager extends Phaser.Plugins.BasePlugin implements IWorldManager {
    public events: IWorldEvent

    private portraitRatio: number
    private portraitWidth: number
    private portraitHeight: number

    private landscapeRatio: number
    private landscapeWidth: number
    private landscapeHeight: number

    private worldWidth: number
    private worldHeight: number
    private worldRatio: number

    private autoResize: boolean
    private disableLandscape: boolean
    private fullSizeOnLandscape: boolean

    private currentLayout: string
    private forcePixelRatio: number

    public configure(payload: IWorldPayload) {
        this.events = new WorldEvent()

        const {
            autoResize,
            portraitRatio,
            portraitWidth,
            portraitHeight,
            landscapeWidth,
            landscapeHeight,
            landscapeRatio,
            disableLandscape,
            fullSizeOnLandscape,
        } = payload

        this.autoResize = autoResize
        this.disableLandscape = disableLandscape
        this.fullSizeOnLandscape = fullSizeOnLandscape

        this.portraitRatio = portraitRatio
        this.portraitWidth = portraitWidth
        this.portraitHeight = portraitHeight

        this.landscapeRatio = landscapeRatio
        this.landscapeWidth = landscapeWidth
        this.landscapeHeight = landscapeHeight

        this.initWorldSize()
        this.addEventResize()
    }

    public resize(forcePixelRatio?: number): void {
        if (forcePixelRatio && forcePixelRatio > 0) {
            this.forcePixelRatio = forcePixelRatio
        }

        // Make sure dom is rendered and focused
        const { width, height } = this.getCanvasSizeFixedRatio(this.worldRatio)

        this.resizeCanvas(width, height)

        this.game.scene.scenes.forEach((scene) => {
            const camera = scene.cameras.main
            if (!camera) return

            const zoomRatio = this.getZoomRatio()
            const { width, height } = this.getWorldSize()

            camera.setZoom(zoomRatio)
            camera.centerOn(width / 2, height / 2)
        })

        this.events.emit(WORLD_EVENTS.RESIZE, { width, height })

        if (this.isLandscape() && this.currentLayout !== 'landscape') {
            this.events.emit(WORLD_EVENTS.CHANGE_LAYOUT, { layout: 'landscape' })
        } else if (this.currentLayout !== 'portrait') {
            this.events.emit(WORLD_EVENTS.CHANGE_LAYOUT, { layout: 'portrait' })
        }
    }

    private resizeCanvas(width: number, height: number): void {
        // Resize canvas for when dom ready
        this.game.canvas.width = width
        this.game.canvas.height = height
        this.game.scale.resize(width, height)
    }

    public getWorldSize(): WorldSize {
        return { width: this.worldWidth, height: this.worldHeight }
    }

    private initWorldSize(): void {
        this.worldWidth = this.portraitWidth
        this.worldHeight = this.portraitHeight

        if (this.isScreenSmallerRatio(this.portraitRatio)) {
            this.worldHeight = this.worldWidth / this.getScreenRatio()

            this.currentLayout = 'portrait'
        } else if (!this.disableLandscape) {
            this.worldWidth = this.landscapeWidth
            this.worldHeight = this.landscapeHeight

            this.currentLayout = 'landscape'

            // ? Make full screen with screen size
            if (this.fullSizeOnLandscape) {
                this.worldRatio = this.worldWidth / this.worldHeight
                this.landscapeRatio = this.getScreenRatio()

                const { width, height } = this.getCanvasSizeFixedRatio(this.landscapeRatio)

                const zoomRatio = this.getZoomRatio()

                this.worldWidth = width / zoomRatio
                this.worldHeight = height / zoomRatio
            }
        }

        this.worldRatio = this.worldWidth / this.worldHeight

        console.info('🚀 > this.worldRatio', this.worldRatio)
    }

    public getZoomRatio(): number {
        const { width } = this.getWorldSize()
        const { width: canvasWidth } = this.getCanvasSizeFixedRatio(this.worldRatio)

        return canvasWidth / width
    }

    public getPixelRatio(): number {
        if (this.forcePixelRatio > 0) {
            return this.forcePixelRatio
        }

        if (GameCore.Utils.Device.isDesktop()) return 2

        let devicePixelRatio = GameCore.Utils.Device.pixelRatio()

        if (devicePixelRatio > 2) {
            devicePixelRatio = 2
        }

        return devicePixelRatio
    }

    public getPhysicPixels(pixels: number, dpr: number): number {
        return pixels * dpr
    }

    private getCanvasSizeFixedRatio(ratio: number) {
        const DPR = this.getPixelRatio()

        // Canvas size always = screen size * dpr
        let width = this.getScreenWidth() * DPR
        let height = this.getScreenHeight() * DPR

        // For device which has larger ratio
        if (this.isScreenSmallerRatio(ratio)) {
            height = width / ratio
        } else {
            width = height * ratio
        }

        return { width, height }
    }

    public getScreenRatio(): number {
        return this.getScreenWidth() / this.getScreenHeight()
    }

    public getScreenHeight(): number {
        const { body, documentElement } = document
        const { clientHeight: bodyClientHeight } = body
        const { clientHeight: docClientHeight } = documentElement
        return Math.max(docClientHeight, bodyClientHeight) || 0
    }

    public getScreenWidth(): number {
        const { body, documentElement } = document
        const { clientWidth: bodyClientWidth } = body
        const { clientWidth: docClientWidth } = documentElement

        return Math.max(docClientWidth, bodyClientWidth) || 0
    }

    private isScreenSmallerRatio(ratio: number): boolean {
        const screenRatio = this.getScreenRatio()
        return screenRatio < ratio
    }

    private addEventResize() {
        if (!this.autoResize) return

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        window.addEventListener('resize', this.handleResize)
    }

    private handleResize = debounce(() => {
        this.initWorldSize()
        this.resize()
    }, 300)

    public isLandscape(): boolean {
        if (this.disableLandscape) return false

        return this.worldRatio > this.portraitRatio
    }
}

export default WorldManager
