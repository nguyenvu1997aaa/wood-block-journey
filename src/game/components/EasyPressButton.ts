import Button from '@/game/components/Button'

interface IOptions {
    key: string
    frame: string
    width?: number
    height?: number
    paddingZone?: number
    showDebugZone?: boolean
    usePixelPerfect?: boolean
}

class EasyPressButton extends Button {
    private paddingZone: number
    private showDebugZone: boolean
    private debugZone: Phaser.GameObjects.Rectangle

    constructor(scene: Phaser.Scene, options: IOptions) {
        const { key, frame, width, height, usePixelPerfect } = options
        super(scene, key, frame, width, height, usePixelPerfect)

        const { paddingZone = 0, showDebugZone = false } = options

        this.paddingZone = paddingZone
        this.showDebugZone = showDebugZone
    }

    protected updateSize() {
        super.updateSize()

        const { width, height } = this

        const newWidth = width + this.paddingZone
        const newHeight = height + this.paddingZone

        this.setSize(newWidth, newHeight)
        this.hitZone.setSize(newWidth, newHeight)

        if (this.showDebugZone) {
            this.debugZone?.destroy()
            this.debugZone = this.hitZone.drawDebugBox(0xa34212, 0.5)
            this.add(this.debugZone)
        }
    }
}

export default EasyPressButton
