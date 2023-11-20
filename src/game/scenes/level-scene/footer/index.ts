import SPRITES from '@/game/constants/resources/sprites'
import { getJourneyMatchLevel } from '@/modules/match/selectors/match'
import LevelScene from '..'
import HomeButton from '../component/HomeButton'
import PlayButton from '../component/PlayButton'
import StartOverButton from '../component/StartOverButton'

class FooterLevelScreen extends Phaser.GameObjects.Container {
    public scene: LevelScene
    public buttonPlay: PlayButton
    public buttonStartOver: StartOverButton
    public buttonHome: HomeButton
    // public leaderBoardButton: LeaderBoardButton

    constructor(scene: LevelScene) {
        super(scene)

        this.scene = scene

        this.init()

        this.scene.add.existing(this)
    }

    private init(): void {
        this.createButton()
    }

    private createButton(): void {
        this.createButtonPlay()
        this.createButtonStartOver()
        this.createButtonHome()
        // this.createButtonLeaderboard()
    }

    private createButtonPlay(): void {
        this.buttonPlay = new PlayButton(this.scene)

        this.add(this.buttonPlay)

        Phaser.Display.Align.In.Center(this.buttonPlay, this, 40, 1)
    }

    private createButtonStartOver(): void {
        this.buttonStartOver = new StartOverButton(this.scene)

        this.add(this.buttonStartOver)

        Phaser.Display.Align.In.Center(this.buttonStartOver, this, 0, 1)
    }

    private createButtonHome(): void {
        this.buttonHome = new HomeButton(this.scene)

        this.add(this.buttonHome)

        Phaser.Display.Align.In.Center(this.buttonHome, this, -90, 1)
    }

    // private createButtonLeaderboard(): void {
    //     this.leaderBoardButton = new LeaderBoardButton(this.scene)

    //     this.add(this.leaderBoardButton)

    //     Phaser.Display.Align.In.Center(this.leaderBoardButton, this, 131, 1)
    // }

    public updateTextButtonPlay(): void {
        const state = this.scene.storage.getState()
        const level = getJourneyMatchLevel(state)
        const scale = this.scene.world.getPixelRatio()

        if (level === 1) {
            this.buttonPlay.nextLevel.setFrame(SPRITES.DEFAULT.FRAME.TEXT_PLAY)
        } else {
            this.buttonPlay.nextLevel.setFrame(SPRITES.DEFAULT.FRAME.TEXT_NEXT_LEVEL)
        }

        this.buttonPlay.nextLevel.setWorldSize(
            this.buttonPlay.nextLevel.width / scale,
            this.buttonPlay.nextLevel.height / scale
        )
    }
}

export default FooterLevelScreen
