import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES, { demoEffect } from '@/game/constants/resources/sprites'

const { KEY, FRAME: Demo } = SPRITES.EFFECTS
const FRAME = Demo as demoEffect

interface ICoinPositions {
    from: { x: number; y: number }
    to: { x: number; y: number }
}

class CoinMove extends Phaser.GameObjects.Image {
    public onUpdate: Function
    public onComplete: Function

    private positions: ICoinPositions
    private eatAnimation: Phaser.Tweens.Tween

    constructor(scene: Phaser.Scene, positions: ICoinPositions) {
        super(scene, 0, 0, KEY, FRAME.COIN)

        this.setWorldSize(16.5, 15.5)

        this.positions = positions

        this.setDepth(DEPTH_OBJECTS.PRIORITY)

        this.createAnimation()

        this.scene.add.existing(this)
    }

    private createAnimation(): void {
        const scale = 1 / GameCore.Utils.Image.getImageScale()

        const { from, to } = this.positions

        this.eatAnimation = this.scene.add.tween({
            targets: this,
            duration: 1125,
            ease: 'Circ.easeInOut',
            paused: true,
            props: {
                x: {
                    from: from.x,
                    to: to.x,
                },
                y: {
                    from: from.y,
                    to: to.y,
                },
                scale: { from: scale, to: scale },
            },
            onUpdate: () => {
                if (typeof this.onUpdate === 'function') {
                    this.onUpdate()
                }
            },
            onComplete: () => {
                this.destroy()

                if (typeof this.onComplete === 'function') {
                    this.onComplete()
                }
            },
        })
    }

    public run(): void {
        this.eatAnimation.play()
    }
}

export default CoinMove
