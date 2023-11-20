import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'
import { getJourneyChallengeMode, getJourneyMatchScore } from '@/modules/match/selectors/match'
import { isArray } from 'lodash'
import GameScene from '..'
import { TARGET_COLLECT, TARGET_SCORE } from '../constant/target'
import BestScoreBlock from './BestScoreBlock'
import CollectItems from './CollectItems'
import Leaf from './Leaf'
import MainScoreBlock from './MainScoreBlock'
import ProgressBar from './ProgressBar'
import SettingButton from './SettingButton'

const { KEY: KEY_DF, FRAME: FRAME_DF } = SPRITES.DEFAULT

class Header extends Phaser.GameObjects.Container {
    public scene: GameScene
    public buttonSetting: Button
    public bestScoreBlock: BestScoreBlock
    public mainScoreBlock: MainScoreBlock
    public progressBar: ProgressBar
    public collectItems: CollectItems

    // Landscape
    public textMission: Phaser.GameObjects.Image

    constructor(scene: GameScene) {
        super(scene)

        this.scene = scene

        this.setSize(this.scene.gameZone.width, 0)

        scene.add.existing(this)

        this.createSettingButton()

        this.createBestScoreBlock()

        this.createMainScoreBlock()

        this.createProgressBar()

        this.createCollectItems()

        // this.createLeaf()

        this.addTextScore()
    }

    private createLeaf(): void {
        const leaf = new Leaf(this.scene)

        this.add(leaf)

        Phaser.Display.Align.In.Center(leaf, this, 0, leaf.displayHeight / 2 - 5)
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

    private createSettingButton(): void {
        this.buttonSetting = new SettingButton(this.scene)

        this.add(this.buttonSetting)

        Phaser.Display.Align.In.Center(this.buttonSetting, this, 132, 51)
    }

    private createProgressBar() {
        this.progressBar = new ProgressBar(this.scene, 315, 13)

        this.add(this.progressBar)

        Phaser.Display.Align.In.Center(this.progressBar, this, -19, 92)

        this.progressBar.setVisible(false)
    }

    private createCollectItems() {
        this.collectItems = new CollectItems(this.scene)

        this.add(this.collectItems)

        Phaser.Display.Align.In.Center(this.collectItems, this, 0, 52)

        this.collectItems.setVisible(false)
    }

    public getScore() {
        return this.mainScoreBlock.score
    }

    public showItemSingleMode(): void {
        this.mainScoreBlock.setVisible(true)
    }

    public showItemPlayWithFriendsMode(): void {
        this.mainScoreBlock.setVisible(false)
    }

    public start(): void {
        const targetType = this.scene.targetMissionManager.getTargetType()

        if (this.scene.world.isLandscape()) this.updateUILevel()

        switch (targetType) {
            case TARGET_SCORE:
                this.targetScore()
                break

            case TARGET_COLLECT:
                this.targetCollect()
                break
        }
    }

    private targetScore() {
        const targetScore = parseInt(this.scene.targetMissionManager.getTargetValue())
        const state = this.scene.storage.getState()
        const score = getJourneyMatchScore(state) || 0

        if (isArray(targetScore)) return

        this.progressBar.reset()
        this.progressBar.setVisible(true)
        this.progressBar.setTargetScore(targetScore)

        //
        this.mainScoreBlock.reset()
        this.mainScoreBlock.setVisible(true)
        const challengeMode = getJourneyChallengeMode(state)
        if (!challengeMode) {
            this.progressBar.setPercent(score / targetScore)

            this.mainScoreBlock.setScore(score)
            this.mainScoreBlock.setScoreText(score)
        }
        this.collectItems.setVisible(false)
    }

    private targetCollect() {
        this.collectItems.reset()

        this.mainScoreBlock.setVisible(false)
        //
        this.progressBar.setVisible(false)
        //
        const target = this.scene.targetMissionManager.getTargetValue()

        this.collectItems.setTargets(target)
        this.collectItems.setVisible(true)
        this.collectItems.start()
    }

    // Landscape
    public updateUILandscape(): void {
        this.calcSize()

        this.buttonSetting.setVisible(false)
        this.textMission.setVisible(true)

        this.updateUIMainScore()
        this.updateUIProgress()
        this.updateUIMissionGem()
        this.updateUILevel()

        this.textMission.setPosition(-this.width / 2 - 5.5, 10)
        this.collectItems.setPosition(-this.width / 2 - 5.5, 154)
    }

    private calcSize(): void {
        const boardFrameWidth = 425

        this.setSize(boardFrameWidth + 150, 110)
    }

    private addTextScore(): void {
        const imageScale = this.scene.world.getPixelRatio()

        this.textMission = this.scene.make.image({
            key: KEY_DF,
            frame: FRAME_DF.TEXT_MISSION_LANDSCAPE,
        })

        const { width, height } = this.textMission

        this.textMission.setVisible(false)
        this.textMission.setWorldSize(width / imageScale, height / imageScale)

        this.add(this.textMission)
    }

    private updateUIMainScore(): void {
        this.mainScoreBlock.background.setTexture(KEY_DF)
        this.mainScoreBlock.background.setFrame(FRAME_DF.PANEL_SCORE)

        this.mainScoreBlock.background.setWorldSize(86.5, 49.5)

        this.bestScoreBlock.setPosition(-this.width / 2 - 5.5, 115)
        this.mainScoreBlock.setPosition(-this.width / 2 - 5.5, 77)
    }

    private updateUIMissionGem(): void {
        this.collectItems.background.setTexture(KEY_DF)
        this.collectItems.background.setFrame(FRAME_DF.PANEL_MISSION)
        this.collectItems.background.setWorldSize(47.5, 232)
    }

    public updateUILevel(): void {
        const targetType = this.scene.targetMissionManager.getTargetType()

        console.log('targetType', targetType)

        switch (targetType) {
            case TARGET_COLLECT:
                this.bestScoreBlock.setY(245)

                break

            case TARGET_SCORE:
                this.bestScoreBlock.setY(85)

                break

            default:
                this.bestScoreBlock.setY(245)

                break
        }
    }

    private updateUIProgress(): void {
        this.progressBar.setPosition(0, -33)
    }
}

export default Header
