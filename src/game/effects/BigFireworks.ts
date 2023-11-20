import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'
import SOUND_EFFECT from '@/game/constants/soundEffects'

const { KEY, FRAME } = SPRITES.EFFECTS

interface IColors {
    [key: string]: number
}

const { FIREWORKS_SMALL, FIREWORKS_BIG, FIREWORKS_SOAR } = SOUND_EFFECT

class BigFireworks extends Phaser.GameObjects.Container {
    private soar: Phaser.GameObjects.Image
    private fireworks1: Phaser.GameObjects.Image
    private fireworks2: Phaser.GameObjects.Image

    private colors: IColors = {
        red: 0xfb3241,
        blue: 0x1c6dec,
        pink: 0xe905fc,
        green: 0x02cb2c,
        yellow: 0xfdc61b,
    }

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0)

        this.kill()

        this.createObjects()

        this.setDepth(DEPTH_OBJECTS.FIREWORKS)

        this.scene.add.existing(this)
    }

    private createObjects(): void {
        this.soar = this.scene.make.image({
            key: KEY,
            frame: FRAME.FX_FIREWORKS_SOAR_LINE,
            visible: false,
        })

        this.fireworks1 = this.scene.make.image({
            key: KEY,
            frame: FRAME.FX_FIREWORKS_BIG_0,
            visible: false,
        })

        this.fireworks2 = this.scene.make.image({
            key: KEY,
            frame: FRAME.FX_FIREWORKS_BIG_1,
            visible: false,
        })

        this.add([this.soar, this.fireworks2, this.fireworks1])
    }

    private playExplosiveSound(): void {
        const rand = Phaser.Math.RND.between(0, 100)

        let soundKey

        if (rand < 30) {
            soundKey = FIREWORKS_SOAR
        } else if (rand < 70) {
            soundKey = FIREWORKS_BIG
        } else {
            soundKey = FIREWORKS_SMALL
        }

        this.scene.audio.playSound(soundKey)
    }

    // Method
    public randomColor(): void {
        const colors = Object.values(this.colors)

        let index = Phaser.Math.RND.between(0, colors.length - 1)
        let color = colors[index]

        this.fireworks1.setTint(color)

        index = Phaser.Math.RND.between(0, colors.length - 1)
        color = colors[index]

        this.fireworks2.setAlpha(0.5)
        this.fireworks2.setTint(color)
    }

    // Method
    public fire(x: number, fromY: number, toY: number): void {
        this.setVisible(true)
        this.setPosition(x, fromY)
        this.runFireworkAnimation(toY)
        this.playExplosiveSound()
    }

    // Animation
    private runFireworkAnimation(toY: number): void {
        if (!this.scene) return

        const rand = Phaser.Math.RND.between(-120, 120)

        this.setAlpha(0.6)

        this.soar.setVisible(true)
        this.soar.setOrigin(0.5, 0.1)
        this.soar.setFrame(FRAME.FX_FIREWORKS_SOAR_LINE)

        const dpr = this.scene.world.getPixelRatio()

        this.scene.tweens.add({
            targets: [this],
            duration: 600,
            ease: Phaser.Math.Easing.Sine.Out,
            props: {
                y: toY + rand,
                alpha: { from: 0.6, to: 0.2 },
                scale: {
                    from: 0.1,
                    to: 1 / dpr,
                },
            },
            onComplete: this.runSoarExplosiveAnimation,
        })
    }

    private runSoarExplosiveAnimation = (): void => {
        this.setAlpha(0)
        this.setScale(0)

        this.soar.setOrigin(0.5, 0.5)
        this.soar.setFrame(FRAME.FX_FIREWORKS_SOAR_CIRCLE)

        const dpr = this.scene.world.getPixelRatio()

        this.scene.tweens.add({
            targets: [this],
            duration: 200,
            ease: Phaser.Math.Easing.Cubic.Out,
            props: {
                alpha: { from: 0, to: 1 },
                scale: {
                    from: 0,
                    to: Phaser.Math.RND.between(0.8, 1) / dpr,
                },
            },
            onComplete: this.runFireworkExplosiveAnimation,
        })
    }

    private runFireworkExplosiveAnimation = (): void => {
        this.fireworks1.setAlpha(0)
        this.fireworks1.setScale(0.1)
        this.fireworks1.setVisible(true)

        this.scene.tweens.add({
            targets: [this.fireworks1],
            duration: 600,
            ease: Phaser.Math.Easing.Sine.Out,
            props: {
                alpha: { from: 0, to: 1, duration: 300 },
                scale: { from: 0.1, to: Phaser.Math.RND.between(0.6, 0.8) },
            },
        })

        this.fireworks2.setVisible(true)
        this.fireworks2.setScale(0.1)

        this.scene.tweens.add({
            targets: [this.fireworks2],
            duration: 800,
            ease: Phaser.Math.Easing.Cubic.Out,
            props: {
                scale: { from: 0.1, to: Phaser.Math.RND.between(0.5, 0.6) },
            },
        })

        this.runExistAnimation()
    }

    private runExistAnimation = (): void => {
        this.scene.tweens.add({
            targets: [this],
            duration: 600,
            delay: 400,
            ease: Phaser.Math.Easing.Cubic.Out,
            props: {
                alpha: 0,
            },
            onComplete: () => {
                this.setAlpha(1)

                this.soar.setVisible(false)
                this.fireworks1.setVisible(false)
                this.fireworks2.setVisible(false)

                this.kill()
            },
        })
    }
}

export default BigFireworks
