import SPRITES from '@/game/constants/resources/sprites'
import Leader, { ILeaderPayload } from '../common/Leader'

const { FRAME } = SPRITES.DEFAULT

class FooterBar extends Phaser.GameObjects.Container {
    public myScoreBlock: Leader

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.scene = scene

        this.setName('FooterBar')

        this.createMyScoreBlock()

        this.scene.add.existing(this)
    }

    private createMyScoreBlock() {
        this.myScoreBlock = new Leader(this.scene)

        this.myScoreBlock.setFrameBackground(FRAME.LEADERBOARD_BG_ITEM)

        this.myScoreBlock.setVisible(false)

        this.add(this.myScoreBlock)

        Phaser.Display.Align.In.Center(this.myScoreBlock, this)
    }

    public updateMyScoreBlock(payload: ILeaderPayload) {
        this.myScoreBlock.setVisible(true)
        this.myScoreBlock.updateInfo(payload)
        this.myScoreBlock.setRankLight()
        this.myScoreBlock.setScoreLight()
        this.myScoreBlock.setUserNameLight()

        this.myScoreBlock.runShowUpAnimation(0, 1000)
    }
}

export default FooterBar
