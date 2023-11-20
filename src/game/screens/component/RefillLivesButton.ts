import PulsateBubbleAnimation from '@/game/animations/attention/PulsateBubble'
import Button from '@/game/components/Button'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT
const { Lives } = GameCore.Configs

class RefillLivesButton extends Button {
    private heart: Phaser.GameObjects.Image
    private textLives: Phaser.GameObjects.Text

    private groupHeartBeat: Phaser.GameObjects.Container

    private heartBeat: PulsateBubbleAnimation
    private textLivesBeat: PulsateBubbleAnimation
    private icon: Phaser.GameObjects.Image
    private text: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_GREEN)

        this.button.setWorldSize(251, 63)

        this.setName('RefillLives')

        this.createText()
        this.createIcon()
        this.alignItem()
        this.createHeart()
        this.createHeartBeatAnimation()
    }

    private createText() {
        const scale = this.scene.world.getPixelRatio()

        this.text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_REFILL_LIVES,
        })

        this.text.setWorldSize(this.text.width / scale, this.text.height / scale)

        this.add(this.text)
    }

    private createIcon() {
        this.icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_ADS,
        })

        this.icon.setWorldSize(33, 32)

        this.add(this.icon)
    }

    private alignItem(): void {
        const width = this.width
        const iWidth = this.icon.width
        const tWidth = this.text.width
        const margin = 10
        const center = width / 2
        const remainW = (width - margin - iWidth - tWidth) / 2
        const tPx = remainW + tWidth / 2
        const iPx = tPx + margin + iWidth / 2 + tWidth / 2

        Phaser.Display.Align.In.Center(this.icon, this, iPx - center, -2)

        Phaser.Display.Align.In.Center(this.text, this, tPx - center, -2)
    }

    private createHeart() {
        this.heart = this.scene.make.image({
            key: KEY,
            frame: FRAME.LIVES_HEART,
        })

        this.heart.setAngle(-30)

        this.heart.setWorldSize(46, 36)

        this.add(this.heart)

        Phaser.Display.Align.In.Center(this.heart, this, -120, -25)

        this.textLives = this.scene.make.text({
            text: `+${Lives.livesCapacity}`,
            style: {
                fontFamily: FONTS.FONT_FAMILY_ARIAL,
                fontSize: `${this.scene.fontSize(40)}px`,
                fontStyle: '700',
            },
            origin: { x: 0.5, y: 0.5 },
        })

        this.textLives.setAngle(-30)

        this.add(this.textLives)

        Phaser.Display.Align.In.Center(this.textLives, this.heart)
    }

    public runHeartBeatAnimation(): void {
        this.heartBeat.play()
        this.textLivesBeat.play()
    }

    private createHeartBeatAnimation(): void {
        this.heartBeat = new PulsateBubbleAnimation({
            targets: [this.heart],
            props: {
                scale: '+=0.005',
            },
        })

        this.textLivesBeat = new PulsateBubbleAnimation({
            targets: [this.textLives],
            props: {
                scale: '+=0.025',
            },
        })
    }
}

export default RefillLivesButton
