import IconButtonHorizontal from '@/game/components/IconButtonHorizontal'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import AnimationsScene from '..'
import Scroller from '../../../components/Scroller'
import { AnimationAction } from './AnimationAction'
import AnimationButton from './AnimationButton'

interface ItemPos {
    x: number
    y: number
    offsetX: number
}

class AnimationScroller extends Scroller {
    public scene: AnimationsScene

    private nextItemPos: ItemPos

    private animationButtons: AnimationButton[] = []

    private openAnimationScrollerButton: IconButtonHorizontal

    private currentAnimation: AnimationAction
    private currentAnimationText: Phaser.GameObjects.BitmapText

    private background: Phaser.GameObjects.Image

    constructor(scene: AnimationsScene) {
        const { width, height } = scene.gameZone
        const config = {
            listConfigs: [],
            width,
            height,
        }

        super(scene, config)

        this.scene = scene

        const padding = 5
        this.nextItemPos = {
            x: 0,
            y: -height / 2,
            offsetX: -width / 4 - padding,
        }

        this.setPosition(375 / 2, 667 / 2)
        this.setEnable(true)

        this.createBackground(width, height)
        this.createOpenButton()
        this.createCurrentAnimationText()

        this.closeScroller()
    }

    private createBackground(width: number, height: number) {
        this.background = this.scene.make.image({
            key: SPRITES.DEFAULT.KEY,
            frame: SPRITES.DEFAULT.FRAME.BLANK,
        })

        this.background.setOrigin(0, 0)
        this.background.setTint(0x000000)
        this.background.setWorldSize(width, height)

        this.scene.children.bringToTop(this)

        this.background.kill()
    }

    private createOpenButton() {
        const { KEY, FRAME } = SPRITES.DEFAULT
        const button = new IconButtonHorizontal(
            this.scene,
            {
                key: KEY,
                button: FRAME.BUTTON_BLUE,
                icon: FRAME.BLANK,
                text: '     Menu',
            },
            148,
            60
        )

        button.setPosition(0, 50)
        button.kill()

        this.openAnimationScrollerButton = button
        this.openAnimationScrollerButton.onClick = this.openScroller
    }

    private createCurrentAnimationText() {
        this.currentAnimationText = this.scene.make.bitmapText(
            {
                font: FONTS.PRIMARY.KEY,
                size: this.scene.fontSize(18),
                text: '',
                origin: { x: 0.5, y: 0 },
            },
            true
        )

        this.currentAnimationText.setMaxWidth(300, 95) // 95 is underscore char
        this.currentAnimationText.setCenterAlign()

        Phaser.Display.Align.In.TopCenter(this.currentAnimationText, this.scene.gameZone, 0, -50)
    }

    private openScroller = (): void => {
        this.currentAnimation?.stop()

        this.revive()

        this.currentAnimationText.kill()
        this.openAnimationScrollerButton.kill()

        this.background.revive()
    }

    private closeScroller = (): void => {
        this.background.kill()

        this.currentAnimationText.revive()
        this.openAnimationScrollerButton.revive()

        this.kill()
    }

    public addButton(animAction: AnimationAction): void {
        const { x, y, offsetX } = this.nextItemPos
        const padding = 34

        const button = new AnimationButton(this.scene, animAction.name)

        button.setPosition(x + offsetX, y + button.height / 2 + padding)
        this.nextItemPos.offsetX = -offsetX

        if (offsetX > 0) {
            this.nextItemPos.y += button.height + padding
        }

        this.animationButtons.push(button)

        button.onClick = () => {
            this.closeScroller()

            this.currentAnimation?.stop()

            animAction.run()

            this.currentAnimation = animAction

            this.currentAnimationText.setText(button.getName())
        }

        super.addItem(button)
    }

    public runCurrentAnim = () => {
        if (!this.currentAnimation) return

        this.currentAnimation.stop()
        this.currentAnimation.run()
    }
}

export default AnimationScroller
