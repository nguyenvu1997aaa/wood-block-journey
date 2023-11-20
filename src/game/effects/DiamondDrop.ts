import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

export interface IDiamondPositions {
    from: { x: number; y: number }
    to: { x: number; y: number }
}

class DiamondDrop extends Phaser.GameObjects.Image {
    public onUpdate: Function
    public onComplete: Function

    public positions: IDiamondPositions

    private visibleAnimation: Phaser.Tweens.Tween
    private eatAnimation: Phaser.Tweens.Tween

    constructor(scene: Phaser.Scene, positions: IDiamondPositions) {
        super(scene, 0, 0, KEY, FRAME.ICON_ADS)

        this.setWorldSize(25, 24)

        this.positions = positions

        this.setVisible(false)

        this.setDepth(DEPTH_OBJECTS.PRIORITY)

        this.createAnimation()

        this.scene.add.existing(this)
    }

    private createAnimation(): void {
        const { from, to } = this.positions

        const scale = 1 / GameCore.Utils.Image.getImageScale()

        this.visibleAnimation = this.scene.add.tween({
            targets: this,
            duration: 1000,
            paused: true,
            props: {
                alpha: {
                    duration: 500,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    value: { from: 0, to: 1 },
                },
                x: {
                    getStart: () => from.x,
                },
                y: {
                    ease: Phaser.Math.Easing.Bounce.Out,
                    value: {
                        getStart: () => from.y,
                        getEnd: () => from.y + 100,
                    },
                },
                scale: {
                    duration: 400,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    value: { from: scale * 2, to: scale },
                },
            },
            onStart: () => {
                this.setVisible(true)
                // this.scene.audio.playSound(SOUND_EFFECT.DIAMONDS_EAT)
            },
            onComplete: () => {
                this.eatAnimation.play()
            },
        })

        this.eatAnimation = this.scene.add.tween({
            targets: this,
            duration: 500,
            delay: 50,
            ease: 'Circ.easeOut',
            paused: true,
            props: {
                x: {
                    getEnd: () => to.x,
                },
                y: {
                    getEnd: () => to.y,
                },
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

    // Method
    public run(): void {
        this.visibleAnimation.play()
    }
}

export default DiamondDrop
