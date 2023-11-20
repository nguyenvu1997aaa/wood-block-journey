import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'
import GameScene from '..'
import BestScoreBlock from './BestScoreBlock'
import Leaf from './Leaf'
import MainScoreBlock from './MainScoreBlock'
import MyScoreBlock from './MyScoreBlock'
import OpponentScoreBlock from './OpponentScoreBlock'
import ProgressBar from './ProgressBar'
import SettingButton from './SettingButton'

const { KEY, FRAME } = SPRITES.GAMEPLAY
const { KEY: KEY_DF, FRAME: FRAME_DF } = SPRITES.DEFAULT

class Header extends Phaser.GameObjects.Container {
    public scene: GameScene
    public buttonSetting: Button
    public bestScoreBlock: BestScoreBlock
    public mainScoreBlock: MainScoreBlock
    public myScoreBlock: MyScoreBlock
    public opponentScoreBlock: OpponentScoreBlock
    public iconBattle: Phaser.GameObjects.Image
    public progressBar: ProgressBar

    public textScore: Phaser.GameObjects.Image

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene

        this.setSize(this.scene.gameZone.width, 0)

        scene.add.existing(this)

        // this.createLeaf()

        this.createIconBattle()

        this.createBestScoreBlock()

        this.createSettingButton()

        this.createMainScoreBlock()

        this.createMyScoreBlock()

        this.createOpponentScoreBlock()

        this.createProgressBar()

        // Landscape
        this.addTextScore()
    }

    private createLeaf(): void {
        const leaf = new Leaf(this.scene)

        this.add(leaf)

        Phaser.Display.Align.In.Center(leaf, this, 0, leaf.displayHeight / 2)
    }

    private createBestScoreBlock() {
        this.bestScoreBlock = new BestScoreBlock(this.scene)

        this.add(this.bestScoreBlock)

        Phaser.Display.Align.In.Center(this.bestScoreBlock, this, -132, -12.5)
    }

    private createMainScoreBlock() {
        this.mainScoreBlock = new MainScoreBlock(this.scene)

        this.add(this.mainScoreBlock)

        Phaser.Display.Align.In.Center(this.mainScoreBlock, this, 0, 52)
    }

    private createMyScoreBlock() {
        this.myScoreBlock = new MyScoreBlock(this.scene)

        this.myScoreBlock.setVisible(false)

        this.add(this.myScoreBlock)

        Phaser.Display.Align.In.Center(this.myScoreBlock, this, -52, 35)
    }

    private createOpponentScoreBlock() {
        this.opponentScoreBlock = new OpponentScoreBlock(this.scene)

        this.opponentScoreBlock.setVisible(false)

        this.add(this.opponentScoreBlock)

        Phaser.Display.Align.In.Center(this.opponentScoreBlock, this, 52, 35)
    }

    private createSettingButton(): void {
        this.buttonSetting = new SettingButton(this.scene)

        this.add(this.buttonSetting)

        Phaser.Display.Align.In.Center(this.buttonSetting, this, 132, 51)
    }

    private createProgressBar() {
        this.progressBar = new ProgressBar(this.scene, 315, 13)

        this.add(this.progressBar)

        Phaser.Display.Align.In.Center(this.progressBar, this, -19, 92)
    }

    private createIconBattle(): void {
        this.iconBattle = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_BATTLE,
        })

        this.iconBattle.setWorldSize(30, 27)
        this.iconBattle.setVisible(false)

        this.add(this.iconBattle)

        Phaser.Display.Align.In.Center(this.iconBattle, this, 0, 24)
    }

    public getScore() {
        return this.mainScoreBlock.score
    }

    public showItemSingleMode(): void {
        this.mainScoreBlock.setVisible(true)
        this.myScoreBlock.setVisible(false)
        this.opponentScoreBlock.setVisible(false)
        this.iconBattle.setVisible(false)
        this.bestScoreBlock.setVisible(true)
        this.textScore.setVisible(false)
        if (this.scene.world.isLandscape()) {
            this.textScore.setVisible(true)
            this.progressBar.setPosition(0, 0)
        }
    }

    public showItemPlayWithFriendsMode(): void {
        this.mainScoreBlock.setVisible(false)
        this.opponentScoreBlock.setVisible(true)
        this.myScoreBlock.setVisible(true)
        this.iconBattle.setVisible(true)
        if (this.scene.world.isLandscape()) {
            this.bestScoreBlock.setVisible(false)
            this.textScore.setVisible(false)
            this.progressBar.setPosition(0, -33)
        }
    }

    // Landscape
    private addTextScore(): void {
        const imageScale = this.scene.world.getPixelRatio()

        this.textScore = this.scene.make.image({
            key: KEY_DF,
            frame: FRAME_DF.TEXT_SCORE,
        })

        const { width, height } = this.textScore

        this.textScore.setVisible(false)
        this.textScore.setWorldSize(width / imageScale, height / imageScale)

        this.add(this.textScore)
    }

    public updateUILandscape(): void {
        this.calcSize()
        this.buttonSetting.setVisible(false)

        this.textScore.setVisible(true)
        this.textScore.setPosition(-this.width / 2, 8)

        this.opponentScoreBlock.setPosition(100, 0).setScale(0.8)
        this.myScoreBlock.setPosition(-100, 0).setScale(0.8)
        this.iconBattle.setPosition(0, 0)

        this.updateUIMainScore()
        this.updateUIProgress()
        this.updateUIBestScore()
    }

    private calcSize(): void {
        const boardFrameWidth = 425

        this.setSize(boardFrameWidth + 150, 110)
    }

    private updateUIMainScore(): void {
        this.mainScoreBlock.background.setTexture(KEY_DF)
        this.mainScoreBlock.background.setFrame(FRAME_DF.PANEL_SCORE)

        this.mainScoreBlock.background.setWorldSize(86.5, 49.5)

        this.mainScoreBlock.setPosition(-this.width / 2, 56)
    }

    private updateUIProgress(): void {
        this.progressBar.setPosition(0, 0)
        if (this.opponentScoreBlock.visible) this.progressBar.setPosition(0, -33)
    }

    private updateUIBestScore(): void {
        this.bestScoreBlock.setPosition(-this.width / 2, 63)
    }
}

export default Header
