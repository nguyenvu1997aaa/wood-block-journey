import SPINES from '@/game/constants/resources/spines'

class Logo extends Phaser.GameObjects.Container {
    private logo: any

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)

        this.drawLogo()

        scene.add.existing(this)
    }

    private drawLogo(): void {
        this.logo = this.scene.add.spine(0, 0, SPINES.LOGO.KEY, SPINES.LOGO.ANIMATIONS.START_GROW)

        this.add(this.logo)

        this.logo.on('complete', (spine: any) => {
            if (spine.animation.name !== SPINES.LOGO.ANIMATIONS.START_GROW) return

            this.logo.play(SPINES.LOGO.ANIMATIONS.IDLE_GROW, true)
        })
    }
}

export default Logo
