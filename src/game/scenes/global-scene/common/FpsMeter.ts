import FONTS from '@/game/constants/resources/fonts'
import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class FpsMeter extends Phaser.GameObjects.Container {
    public fps = 0

    private fpsString = 'FPS: %1'
    private fpsText: Phaser.GameObjects.BitmapText
    private background: Phaser.GameObjects.Image

    private lastUpdate: number

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0)

        this.createFps()

        this.setDepth(DEPTH_OBJECTS.DEBUG)

        this.scene.add.existing(this)

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update)
    }

    public update = (time: number): void => {
        // ? Reduce the number of updates
        if (time - this.lastUpdate < 800) return

        this.lastUpdate = time

        const actualFps = Math.floor(this.scene.game.loop.actualFps)

        this.setFps(actualFps)
    }

    private setFps(fps: number): void {
        this.fps = fps

        const text = Phaser.Utils.String.Format(this.fpsString, [fps])
        this.fpsText.setText(text)
    }

    private createFps(): void {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.BLANK,
        })

        this.background.setName('BG')
        this.background.setTint(0xd29808)

        this.background.setWorldSize(45, 25)

        this.fpsText = this.scene.make.bitmapText({
            size: this.scene.fontSize(14),
            text: this.fpsString,
            font: FONTS.PRIMARY.KEY,
            origin: { x: 0.5, y: 0.5 },
        })

        this.fpsText.setName('FPS Meter')

        Phaser.Display.Align.In.Center(this.fpsText, this.background)

        this.add([this.background, this.fpsText])

        this.setFps(0)
    }
}

export default FpsMeter
