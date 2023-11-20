import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { getGameplayCurrentStats } from '@/modules/match/selectors/stats'
import GameScene from '../GameScene'

const { KEY, FRAME } = SPRITES.DEFAULT

class BestScoreBlock extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Image
    private iconCrown: Phaser.GameObjects.Image
    public bestScoreText: Phaser.GameObjects.BitmapText

    constructor(scene: GameScene) {
        super(scene)

        this.setPosition(0, 97 / 2)

        this.createBackground()

        this.createScoreText()

        this.createIconCrown()

        this.scene.add.existing(this)
    }

    private createBackground(): void {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.BEST_SCORE_FRAME,
        })

        this.background.setWorldSize(55, 77)

        this.add(this.background)

        Phaser.Display.Align.In.Center(this.background, this)
    }

    private createScoreText(): void {
        this.bestScoreText = this.scene.make.bitmapText({
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(26),
            origin: { x: 0.5, y: 0.5 },
            text: '0',
        })

        this.add(this.bestScoreText)

        Phaser.Display.Align.In.Center(this.bestScoreText, this.background, 0, 25)
    }

    private createIconCrown(): void {
        this.iconCrown = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_CROWN,
        })

        this.iconCrown.setWorldSize(20, 18)

        this.add(this.iconCrown)

        Phaser.Display.Align.In.Center(this.iconCrown, this.background, 0, 5)
    }

    public setScoreText(score: number): void {
        this.bestScoreText.setText(String(score))
    }

    public updateBestScoreText(currentScore: number) {
        const state = this.scene.storage.getState()
        const gamePlayCurrentStats = getGameplayCurrentStats(state)
        const { bestScore } = gamePlayCurrentStats
        if (currentScore > bestScore) this.setScoreText(currentScore)
    }
}

export default BestScoreBlock
