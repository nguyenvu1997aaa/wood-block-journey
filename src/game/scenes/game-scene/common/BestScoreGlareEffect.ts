import SPINES from '@/game/constants/resources/spines'
import GameScene from '..'

export default class BestScoreGlareEffect extends Phaser.GameObjects.Container {
    public scene: GameScene

    private bestScoreSpine: any

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene

        scene.add.existing(this)
    }

    private createSpineEffect(): void {
        const dpr = this.scene.world.getPixelRatio()

        this.bestScoreSpine = this.scene.add.spine(
            0,
            630,
            SPINES.BEST_SCORE.KEY,
            SPINES.BEST_SCORE.ANIMATIONS.ANIM
        )

        this.bestScoreSpine.preMultipliedAlpha = true

        this.bestScoreSpine.scale = 1 / dpr

        this.add(this.bestScoreSpine)

        this.bestScoreSpine.on('complete', () => {
            this.bestScoreSpine.setVisible(false)
        })
    }

    public playEffect(): void {
        if (!this.bestScoreSpine) {
            this.createSpineEffect()

            return
        }

        this.bestScoreSpine.setVisible(true)
        this.bestScoreSpine.play(SPINES.BEST_SCORE.ANIMATIONS.ANIM)
    }
}
