import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.EFFECTS

interface IColors {
    [key: string]: number
}

class SmallFireworks extends Phaser.GameObjects.Sprite {
    private bonusPosY: number

    private colors: IColors = {
        red: 0xfb3241,
        blue: 0x1c6dec,
        pink: 0xe905fc,
        green: 0x02cb2c,
        yellow: 0xfdc61b,
    }

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, KEY, FRAME.FX_FIREWORKS_SMALL)

        this.bonusPosY = 100

        this.kill()
        this.setWorldSize(49, 49.5)

        this.setDepth(DEPTH_OBJECTS.FIREWORKS)

        this.scene.add.existing(this)
    }

    public randomColor(): void {
        const colors = Object.values(this.colors)
        const index = Phaser.Math.RND.between(0, colors.length - 1)

        const color = colors[index]
        this.setTintFill(color)
    }

    public setColor(color: string): void {
        this.setTintFill(this.colors[color])
    }

    // Method
    public fire(x: number, fromY: number, toY: number): void {
        this.revive()
        this.setPosition(x, fromY)
        this.runFireworkAnimation(toY)
        // this.scene.audio.playSound(SOUND_EFFECT.FIREWORKS_SOAR, { volume: 0.2 })
    }

    // Animation
    private runFireworkAnimation(toY: number): void {
        if (!this.scene) return

        const scale = 1 / GameCore.Utils.Image.getImageScale()
        const rand = Phaser.Math.RND.between(0, this.bonusPosY)

        this.scene.tweens.add({
            targets: [this],
            duration: 300,
            ease: Phaser.Math.Easing.Circular.Out,
            props: {
                angle: {
                    repeat: -1,
                    value: 360,
                },
                scale: {
                    yoyo: true,
                    value: scale * 0.8,
                },
            },
        })

        this.scene.tweens.add({
            targets: [this],
            duration: 800,
            ease: Phaser.Math.Easing.Circular.Out,
            props: {
                y: toY + rand,
            },
            onComplete: () => {
                this.scene.tweens.killTweensOf(this)
                this.kill()
            },
        })
    }
}

export default SmallFireworks
