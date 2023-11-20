import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import JourneyScene from '../..'

const { KEY, FRAME } = SPRITES.DEFAULT
const { KEY: KEY_32 } = SPRITES.GAMEPLAY_32

export default class CollectItem extends Phaser.GameObjects.Container {
    public scene: JourneyScene
    private imageGem: Phaser.GameObjects.Image
    private text: Phaser.GameObjects.BitmapText

    constructor(scene: JourneyScene) {
        super(scene)

        this.scene = scene

        this.init()
    }

    private init(): void {
        this.createImageGem()
        this.createText()
    }

    private createImageGem(): void {
        this.imageGem = this.scene.make.image({
            key: KEY_32,
        })

        this.imageGem.setWorldSize(35, 35)

        this.add(this.imageGem)

        Phaser.Display.Align.In.Center(this.imageGem, this, 0, -10.5)
    }

    private createText(): void {
        this.text = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(42),
            origin: { x: 0.5, y: 0.5 },
            text: '0',
        })

        this.add(this.text)

        Phaser.Display.Align.In.Center(this.text, this, 0, 29)
    }

    public updateGem(frame: string): void {
        this.imageGem.setFrame(frame)
    }

    public updateText(amount: number): void {
        this.text.setText(`x${amount}`)
    }

    public getFrame(): string {
        return this.imageGem.frame.name
    }
}
