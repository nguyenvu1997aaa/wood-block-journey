import ShakeHorizontalAnimation from '@/game/animations/attention/ShakeHorizontal'
import BaseAnimation from '@/game/animations/BaseAnimation'
import Loading from '@/game/components/Loading'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import Leaders from '../common/Leaders'

const { KEY, FRAME } = SPRITES.DEFAULT

class Board extends Phaser.GameObjects.Container {
    public leaders: Leaders
    private loading: Loading
    private message: Phaser.GameObjects.BitmapText
    private textMessage: Phaser.GameObjects.Text

    private messageAnimation: BaseAnimation

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.setSize(310, 430)

        this.createLoading()
        this.createMessage()
        this.createText()
        this.createContents()
        this.createAnimation()

        this.scene.add.existing(this)
    }

    public showLoading(visible: boolean): void {
        this.loading.setVisible(visible)
        this.showMessage(false)
    }

    public showMessage(visible: boolean, message?: string): void {
        this.message.setVisible(visible)

        if (message) {
            this.message.setText(message)
            this.textMessage.setText(message)
            this.messageAnimation.play()
        }

        const locale = this.scene.facebook.getLocale()

        if (locale == 'ar') {
            this.textMessage.setVisible(true)
            this.message.setVisible(false)
        }
    }

    private createLoading(): void {
        this.loading = new Loading(this.scene)

        this.loading.setVisible(false)

        this.add(this.loading)

        // Phaser.Display.Align.In.Center(this.loading, this.background)
    }

    private createMessage(): void {
        this.message = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(40),
            origin: { x: 0.5, y: 0.5 },
        })

        this.message.setTint(0x9d6d3c)

        this.add(this.message)

        Phaser.Display.Align.In.Center(this.message, this)
    }

    private createText(): void {
        this.textMessage = this.scene.make.text({
            style: {
                fontFamily: FONTS.FONT_FAMILY,
                fontSize: `${this.scene.fontSize(40)}px`,
            },
            origin: { x: 0.5, y: 0.5 },
        })

        this.textMessage.setTint(0x73391a)
        this.textMessage.setVisible(false)

        this.add(this.textMessage)

        Phaser.Display.Align.In.Center(this.textMessage, this)
    }

    private createContents(): void {
        this.createLeaders()

        this.createContentBackground()
    }

    private createLeaders(): void {
        const width = 310
        const height = 337
        const offsetY = -11
        this.leaders = new Leaders(this.scene)
        this.add(this.leaders)

        Phaser.Display.Align.In.Center(this.leaders, this, 0, offsetY)
    }

    private createContentBackground(): void {
        const container = this.scene.make.container({})

        const backgroundTop = this.scene.make.image({
            key: KEY,
            frame: FRAME.LEADERBOARD_BG_BOTTOM,
        })

        backgroundTop.setFlipY(true)

        backgroundTop.setWorldSize(315, 22)

        const backgroundMiddle = this.scene.make.image({
            key: KEY,
            frame: FRAME.LEADERBOARD_BG_MIDDLE,
        })

        backgroundMiddle.setWorldSize(315, 300)

        const backgroundBottom = this.scene.make.image({
            key: KEY,
            frame: FRAME.LEADERBOARD_BG_BOTTOM,
        })

        backgroundBottom.setWorldSize(315, 22)

        container.add(backgroundTop)

        container.add(backgroundMiddle)

        container.add(backgroundBottom)

        Phaser.Display.Align.In.Center(backgroundMiddle, container)
        Phaser.Display.Align.In.Center(
            backgroundTop,
            backgroundMiddle,
            0,
            -backgroundMiddle.displayHeight / 2 - backgroundTop.displayHeight / 2
        )
        Phaser.Display.Align.In.Center(
            backgroundBottom,
            backgroundMiddle,
            0,
            backgroundMiddle.displayHeight / 2 + backgroundBottom.displayHeight / 2
        )

        this.add(container)

        Phaser.Display.Align.In.Center(container, this, 0, -10)
    }

    private createAnimation(): void {
        this.messageAnimation = new ShakeHorizontalAnimation({
            targets: [this.message],
            duration: 60,
            repeat: 2,
        })
    }
}

export default Board
