import AvatarFrame from '@/game/components/AvatarFrame'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import GameScene from '../JourneyScene'

const { KEY, FRAME } = SPRITES.GAMEPLAY

class ScoreBlock extends Phaser.GameObjects.Container {
    public titleSprite: Phaser.GameObjects.Image
    public background: Phaser.GameObjects.Image
    public textScore: Phaser.GameObjects.BitmapText
    public avatar: AvatarFrame
    public score: number

    constructor(scene: GameScene) {
        super(scene)
    }

    public initScoreBlockAvatar(): void {
        this.createAvatar()

        this.createBackgroundScore()

        this.createScoreText()

        this.setScore(0)

        this.setScoreText(0)
    }

    public createAvatar() {
        this.avatar = new AvatarFrame(this.scene, {
            key: KEY,
            frame: FRAME.AVATAR_BORDER,
            background: FRAME.AVATAR_BACKGROUND,
            width: 37.5,
            height: 37.5,
            radius: 37.5,
            borderWidth: 5,
        })

        this.add(this.avatar)

        Phaser.Display.Align.In.Center(this.avatar, this, 0, -10)
    }

    public createBackgroundScore() {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.BG_SCORE,
        })

        this.background.setWorldSize(80, 27)

        this.add(this.background)

        Phaser.Display.Align.In.Center(this.background, this, 0, 25)
    }

    public createScoreText() {
        this.textScore = this.scene.make.bitmapText({
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(35),
            text: '0',
            origin: { x: 0.5, y: 0.5 },
        })

        this.add(this.textScore)

        Phaser.Display.Align.In.Center(this.textScore, this.background)
    }

    public setScore(score: number) {
        this.score = score
    }

    public setScoreText(score: number) {
        this.textScore.setText(String(score))
    }
}

export default ScoreBlock
