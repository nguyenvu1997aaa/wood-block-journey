import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import GameScene from '../JourneyScene'

const { KEY, FRAME } = SPRITES.DEFAULT

class BestScoreBlock extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Image
    public bestScoreText: Phaser.GameObjects.BitmapText
    public titleText: Phaser.GameObjects.BitmapText
    public titleText2: Phaser.GameObjects.Text

    public dayText: Phaser.GameObjects.BitmapText
    public titleDayText: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text

    constructor(scene: GameScene) {
        super(scene)

        this.setPosition(0, 97 / 2)

        this.createBackground()

        this.createScoreText()

        this.createLevelTitleText()

        this.createLevelTitleText2()

        this.createTitleDayText()

        this.createDayText()

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
            size: this.scene.fontSize(32),
            origin: { x: 0.5, y: 0.5 },
            text: '0',
        })

        this.add(this.bestScoreText)

        Phaser.Display.Align.In.Center(this.bestScoreText, this.background, 0, 23)
    }

    private createTitleDayText(): void {
        const { lang } = this.scene.game
        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            this.titleDayText = this.scene.make.text({
                style: {
                    fontFamily: FONTS.FONT_FAMILY,
                    fontSize: `${this.scene.fontSize(40)}px`,
                },
                origin: { x: 0.5, y: 0.5 },
                text: lang.Text.mmddyy,
            })

            this.titleDayText.setTint(0xead2b0)
        } else {
            this.titleDayText = this.scene.make.bitmapText({
                font: FONTS.PRIMARY_LIGHT.KEY,
                size: this.scene.fontSize(30),
                origin: { x: 0.5, y: 0.5 },
                text: lang.Text.mmddyy,
            })
        }

        if (locale == 'id') this.titleDayText.setFontSize(this.scene.fontSize(25))

        this.add(this.titleDayText)

        Phaser.Display.Align.In.Center(this.titleDayText, this.background, 0, 4)
    }

    private createDayText(): void {
        this.dayText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(24),
            origin: { x: 0.5, y: 0.5 },
            text: '0',
        })

        this.add(this.dayText)

        Phaser.Display.Align.In.Center(this.dayText, this.background, 0, 23)
    }

    private createLevelTitleText(): void {
        this.titleText = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(24),
            origin: { x: 0.5, y: 0.5 },
            text: this.scene.lang.Text.LEVEL,
        })

        this.add(this.titleText)

        Phaser.Display.Align.In.Center(this.titleText, this.background, 0, 4)
    }

    private createLevelTitleText2(): void {
        this.titleText2 = this.scene.make.text({
            text: this.scene.lang.Text.LEVEL,
            style: {
                fontFamily: FONTS.FONT_FAMILY,
                fontSize: `${this.scene.fontSize(32)}px`,
            },
            origin: { x: 0.5, y: 0.5 },
        })

        this.titleText2.setTint(0xeed3b2)

        this.titleText2.setVisible(false)

        this.add(this.titleText2)

        Phaser.Display.Align.In.Center(this.titleText2, this.background, 0, 4)
    }

    public setScoreText(score: number): void {
        this.bestScoreText.setText(String(score))
    }

    public setDayText(day: string): void {
        this.dayText.setText(day)
    }

    public showTextScore(): void {
        this.titleText.setVisible(true)
        this.bestScoreText.setVisible(true)

        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            this.titleText2.setVisible(true)
            this.titleText.setVisible(false)
        }

        this.titleDayText.setVisible(false)
        this.dayText.setVisible(false)
    }

    public showTextDay(): void {
        this.titleText.setVisible(false)
        this.titleText2.setVisible(false)
        this.bestScoreText.setVisible(false)

        this.titleDayText.setVisible(true)
        this.dayText.setVisible(true)
    }
}

export default BestScoreBlock
