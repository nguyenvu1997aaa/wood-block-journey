import { AnalyticsEvents } from '@/constants/Analytics'
import WORLD_EVENTS from '@/plugins/world/constants/events'

class Screen extends Phaser.GameObjects.Container implements IScreen {
    protected zone: Phaser.GameObjects.Zone
    protected background: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene, name: string, width?: number, height?: number) {
        super(scene)

        this.setName(name)
        this.setVisible(false)

        const { width: worldWidth, height: worldHeight } = this.scene.world.getWorldSize()
        this.setSize(width || worldWidth, height || worldHeight)

        this.addZone()
        this.addBackground()
        this.registerEvents()
    }

    public open(data?: TObject): void {
        if (GameCore.Utils.Valid.isObject(data)) {
            this.setDataEnabled()
            this.setData(data)
        }

        this.setBlockInputOutsideEnabled(true)

        this.scene.screen.bringToTop(this.name)

        if (this.visible) return
        this.setVisible(true)

        this.logPageviewOnOpen()
        this.logEventOpen()
        this.handleResize()
    }

    public close(): void {
        this.setBlockInputOutsideEnabled(false)

        if (!this.visible) return
        this.setVisible(false)

        this.logPageviewOnClose()
    }

    public incY(y: number) {
        this.y += y
        this.background.y -= y
    }

    public incX(x: number) {
        this.x += x
        this.background.x -= x
    }

    public incScale(scale: number) {
        this.scale += scale
        this.background.scale -= scale ^ (scale * (100 / scale))
    }

    // * Enable input being blocked outside of this screen
    // ? This is useful for screens that are overlaid on top of other screens
    public setBlockInputOutsideEnabled(enable: boolean): void {
        this.scene.input.setTopOnly(enable)
    }

    protected addZone(): void {
        this.zone = this.scene.add.zone(0, 0, this.width, this.height)
        this.zone.setInteractive({})
        this.add(this.zone)
    }

    protected addBackground(): void {
        const texture = 'screen-background'

        if (!this.scene.textures.exists(texture)) {
            const width = this.width + 2
            const height = this.height + 2

            const graphics = this.scene.add.graphics()

            graphics.fillStyle(0x000000, 1)
            graphics.fillRect(0, 0, width, height)

            // Create a background texture from a graphics
            graphics.generateTexture(texture, width, height)
            graphics.destroy()
        }

        this.background = this.scene.add.image(0, 0, texture)

        this.add(this.background)
    }

    private registerEvents(): void {
        this.scene.world.events.on(WORLD_EVENTS.RESIZE, this.handleResize, this)
    }

    private handleResize(): void {
        const { width, height } = this.scene.world.getWorldSize()

        this.setSize(width, height).setPosition(width / 2, height / 2)
        this.zone.setSize(this.width, this.height)
        this.background.setDisplaySize(this.width, this.height)
    }

    protected logPageviewOnOpen() {
        this.scene.analytics.pageview(this.name)
    }

    protected logPageviewOnClose() {
        this.scene.analytics.pageview(this.scene.scene.key)
    }

    protected logEventOpen() {
        this.scene.analytics.event(AnalyticsEvents.SCREEN_OPEN, {
            screen_name: this.getScreenName(),
        })
    }

    public getScreenName() {
        return GameCore.Utils.String.toUpperCamelCase(this.name.toLowerCase())
    }
}

export default Screen
