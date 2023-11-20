import FONTS from '@/game/constants/resources/fonts'
import EasyPressButton from './EasyPressButton'

class IconButtonVertical extends EasyPressButton {
    private label: Phaser.GameObjects.BitmapText

    constructor(scene: Phaser.Scene, key: string, frame: string, width?: number, height?: number) {
        super(scene, {
            key,
            frame,
            width,
            height,
            paddingZone: 50,
            showDebugZone: false,
            usePixelPerfect: false,
        })

        if (width && height) {
            this.button.setWorldSize(width, height)
        }

        this.createLabel()
    }

    public setLabel(text: string): void {
        this.label.setText(text)
    }

    private createLabel(): void {
        this.label = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(24),
            origin: { x: 0.5, y: 0.5 },
        })

        this.label.setAlpha(0.45)

        this.add(this.label)

        Phaser.Display.Align.In.BottomCenter(this.label, this.button, 0, 16)
    }
}

export default IconButtonVertical
