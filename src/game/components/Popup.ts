import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

export interface iPopup {
    forceHeightTop: number
}

class Popup extends Phaser.GameObjects.Container {
    private top: Phaser.GameObjects.Image
    private mid: Phaser.GameObjects.Image
    private bottom: Phaser.GameObjects.Image
    private payload?: iPopup

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        payload?: iPopup
    ) {
        super(scene, x, y)

        this.payload = payload

        this.setSize(width, height)

        this.setDepth(DEPTH_OBJECTS.POPUP)

        this.createPopup()

        this.scene.add.existing(this)
    }

    public set onClose(callback: Function) {
        this.setInteractive({
            useHandCursor: true,
        })

        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)
    }

    private createPopup(): void {
        this.createPopupImages()
        this.updatePopupSize()
        this.alignPopupImages()
    }

    private createPopupImages(): void {
        this.top = this.scene.add.image(0, 0, KEY, FRAME.POPUP_TOP)
        this.mid = this.scene.add.image(0, 0, KEY, FRAME.POPUP_MID)
        this.bottom = this.scene.add.image(0, 0, KEY, FRAME.POPUP_BOTTOM)

        // * Sort depth by index
        this.add([this.top, this.mid, this.bottom])
    }

    private updatePopupSize(): void {
        const topHeight =
            this.payload?.forceHeightTop || (this.width * this.top.height) / this.top.width

        // ? space is size of assets
        this.top.setWorldSize(this.width, topHeight)
        this.bottom.setWorldSize(this.width, (this.width * this.bottom.height) / this.bottom.width)
        this.mid.setWorldSize(
            this.width,
            this.height - this.top.displayHeight - this.bottom.displayHeight
        )
    }

    private alignPopupImages(): void {
        Phaser.Display.Align.In.Center(
            this.top,
            this,
            0,
            -this.mid.displayHeight / 2 - this.top.displayHeight / 2
        )
        Phaser.Display.Align.In.Center(this.mid, this)
        Phaser.Display.Align.In.Center(
            this.bottom,
            this,
            0,
            this.mid.displayHeight / 2 + this.bottom.displayHeight / 2
        )
    }

    public setFrameTop(frame: string, width?: number, height?: number): void {
        if (!width) width = this.top.displayWidth
        if (!height) height = this.top.displayHeight

        this.top.setFrame(frame)
        this.top.setWorldSize(width, height)
    }
}
export default Popup
