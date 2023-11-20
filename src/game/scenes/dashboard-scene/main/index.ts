import PulsateBubbleAnimation from '@/game/animations/attention/PulsateBubble'
import DEPTH_OBJECTS from '@/game/constants/depth'
import DailyChallengeButton from './DailyChallengeButton'
import JourneyButton from './JourneyButton'
import Logo from './Logo'
import PlaySingleButton from './PlaySingleButton'
import SettingButton from './SettingButton'

class MainContent extends Phaser.GameObjects.Container {
    public logo: Logo
    public playSingleButton: PlaySingleButton
    public journeyButton: JourneyButton

    //
    // public leaderBoardButton: LeaderBoardButton
    public dailyChallengeButton: DailyChallengeButton
    public settingButton: SettingButton

    private playSingleButtonAnimation: PulsateBubbleAnimation

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.createLogo()
        //
        this.createPlaySingleButton()
        this.createJourneyButton()
        //
        // this.createLeaderBoardButton()
        this.createDailyChallengeButton()
        this.createSettingButton()

        // this.createPlaySingleButtonAnimation()
        // this.runPlaySingleButtonAnimation()

        this.alignButton()

        this.scene.add.existing(this)
    }

    private createLogo(): void {
        this.logo = new Logo(this.scene, 0, 0)

        this.logo.setDepth(DEPTH_OBJECTS.ON_TOP)

        this.add(this.logo)

        Phaser.Display.Align.In.Center(this.logo, this, 0, -140)
    }

    private createPlaySingleButton(): void {
        this.playSingleButton = new PlaySingleButton(this.scene)
        this.add(this.playSingleButton)
    }

    private runPlaySingleButtonAnimation(): void {
        this.playSingleButtonAnimation.play()
    }

    private createPlaySingleButtonAnimation(): void {
        this.playSingleButtonAnimation = new PulsateBubbleAnimation({
            targets: [this.playSingleButton],
            props: {
                scale: { from: 1, to: 1.05 },
            },
        })
    }

    private createJourneyButton(): void {
        this.journeyButton = new JourneyButton(this.scene)
        this.add(this.journeyButton)
    }

    //
    // private createLeaderBoardButton(): void {
    //     this.leaderBoardButton = new LeaderBoardButton(this.scene)
    //     this.add(this.leaderBoardButton)
    // }

    private createDailyChallengeButton(): void {
        this.dailyChallengeButton = new DailyChallengeButton(this.scene)
        this.add(this.dailyChallengeButton)
    }

    private createSettingButton(): void {
        this.settingButton = new SettingButton(this.scene)
        this.add(this.settingButton)
    }

    private alignButton() {
        Phaser.Display.Align.In.Center(this.playSingleButton, this, 0, 44)
        Phaser.Display.Align.In.Center(this.journeyButton, this, 0, 118)

        // Phaser.Display.Align.In.Center(this.leaderBoardButton, this, -90, 192)
        Phaser.Display.Align.In.Center(this.dailyChallengeButton, this, -60, 192)
        Phaser.Display.Align.In.Center(this.settingButton, this, 60, 192)
    }
}

export default MainContent
