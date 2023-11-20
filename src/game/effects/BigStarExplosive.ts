import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.EFFECTS

class BigStarExplosive extends Phaser.GameObjects.Container {
    private halo: Phaser.GameObjects.Image
    private star: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.createStar()

        this.createHalo()

        this.scene.add.existing(this)
    }

    public run(): void {
        this.runStarAnimation()
        this.runHaloAnimation()
    }

    private createStar(): void {
        this.star = this.scene.make.image({
            key: KEY,
            frame: FRAME.FX_STAR_YELLOW,
            visible: false,
        })

        this.star.setWorldSize(35, 35)

        this.add(this.star)
    }

    private createHalo(): void {
        this.halo = this.scene.make.image({
            key: KEY,
            frame: FRAME.FX_CIRCLE,
            visible: false,
        })

        this.halo.setWorldSize(162, 162)

        this.add(this.halo)
    }

    // Animations
    private runStarAnimation(): void {
        this.scene.tweens.killTweensOf(this.star)

        this.star.setVisible(true)

        const scale = 1 / GameCore.Utils.Image.getImageScale()

        this.scene.tweens.add({
            targets: [this.star],
            duration: 400,
            ease: Phaser.Math.Easing.Quintic.Out,
            props: {
                scaleX: { start: scale * 16, to: 0 },
                scaleY: { start: scale * 10, to: 0 },
            },
            onComplete: () => {
                this.star.setVisible(false)
            },
        })
    }

    private runHaloAnimation(): void {
        this.scene.tweens.killTweensOf(this.halo)

        this.halo.setScale(0)
        this.halo.setVisible(true)

        this.scene.tweens.add({
            targets: [this.halo],
            duration: 200,
            ease: Phaser.Math.Easing.Cubic.Out,
            props: {
                scale: { from: 0, to: 8 },
                alpha: { from: 1, to: 0 },
            },
            onComplete: () => {
                this.halo.setVisible(false)
            },
        })
    }
}

export default BigStarExplosive
