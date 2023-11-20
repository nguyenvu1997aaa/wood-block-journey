import SPRITES from '@/game/constants/resources/sprites'
const { KEY, FRAME } = SPRITES.GAMEPLAY

class TapTutorialHand extends Phaser.GameObjects.Container {
    private hand: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.name = 'TapTutorialHand'
        this.addHand()

        this.scene.add.existing(this)
    }

    private addHand() {
        this.hand = this.scene.make.image({
            key: KEY,
            frame: FRAME.HAND,
            origin: { x: 0.5, y: 0.5 },
        })

        this.hand.setWorldSize(65.5, 55.5)

        this.add(this.hand)
    }

    public playAnimation(startDelay = 0, repeatDelay = 800): void {
        const scale = 1 / GameCore.Utils.Image.getImageScale()

        this.hand.angle = 30

        this.scene?.tweens.add({
            delay: startDelay,
            targets: [this.hand],
            ease: Phaser.Math.Easing.Cubic.Out,
            props: {
                alpha: {
                    start: 0,
                    value: 1,
                    duration: 200,
                },
                scale: {
                    duration: 400,
                    start: scale * 1.6,
                    to: scale * 1.2,
                },
                angle: { from: 30, value: 0, duration: 400 },
            },
            onComplete: () => {
                this.scene?.tweens.add({
                    targets: [this.hand],
                    delay: 200,
                    duration: 200,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    props: {
                        alpha: 0,
                    },
                    onComplete: () => {
                        this.hand.x = 0
                        this.hand.y = 0
                        this.hand.scale = scale
                        this.playAnimation(repeatDelay)
                    },
                })
            },
        })
    }

    public stopAnimation(): void {
        this.scene.tweens.killTweensOf(this.hand)
    }

    protected preDestroy() {
        this.scene.tweens.killTweensOf(this.hand)
    }
}

export default TapTutorialHand
