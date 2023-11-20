import SPRITES from '@/game/constants/resources/sprites'
import Leaf from './Leaf'
import LevelScene from '..'
import { getLives } from '@/modules/lives/selectors/lives'
import LivesTimer from '@/game/components/LivesTimer'

const { KEY, FRAME } = SPRITES.DEFAULT

class HeaderLevelScreen extends Phaser.GameObjects.Container {
    public scene: LevelScene

    private livesTimer: LivesTimer

    constructor(scene: LevelScene) {
        super(scene)

        this.scene = scene

        scene.add.existing(this)

        this.init()
    }

    private init(): void {
        this.createText()
        // this.createLeaf()
        this.createLivesTimer()
    }

    private createText(): void {
        const scale = this.scene.world.getPixelRatio()
        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_JOURNEY,
        })
        text.setWorldSize(text.width / scale, text.height / scale)

        this.add(text)

        Phaser.Display.Align.In.Center(text, this, 0, 14)
    }

    private createLeaf(): void {
        const leaf = new Leaf(this.scene)
        this.add(leaf)

        Phaser.Display.Align.In.TopCenter(leaf, this, 0, leaf.displayHeight / 2 - 30)
    }

    private createLivesTimer(): void {
        this.livesTimer = new LivesTimer(this.scene)

        this.livesTimer.startIntervalTimer()

        this.add(this.livesTimer)

        Phaser.Display.Align.In.Center(this.livesTimer, this, 0, 50)
    }

    public updateTextLives(): void {
        const state = this.scene.storage.getState()
        const lives = getLives(state)

        this.livesTimer.setLives(lives)
    }
}

export default HeaderLevelScreen
