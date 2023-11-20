import EasyPressButton from '@/game/components/EasyPressButton'
import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class AnimationButton extends EasyPressButton {
    private animationNameStr: string
    private animationName: Phaser.GameObjects.BitmapText

    constructor(scene: Phaser.Scene, key: string) {
        const valid = scene.textures.exists(key)

        super(scene, {
            key: valid ? key : KEY,
            frame: valid ? '' : FRAME.BLANK,
            width: 160,
            height: 120,
        })

        this.updateSize()
        this.createText(valid ? KEY : key || '')

        this.scene.children.bringToTop(this)

        !valid && this.loadImage(key)
    }

    private createText(text: string): void {
        this.animationNameStr = text

        const textBtn = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(14),
            text: this.normalizeText(text),
            origin: { x: 0.5, y: 0 },
        })

        textBtn.setPosition(0, this.button.height / 2)
        textBtn.setCenterAlign()
        textBtn.setMaxWidth(this.button.width, 95) // 95 is underscore char
        this.animationName = textBtn

        this.add([textBtn])
    }

    private normalizeText(text: string) {
        return text.replace(/\.?([A-Z]+)/g, '_$1').replace(/^_/, '')
    }

    private loadImage(key: string) {
        const image = this.scene.load.image(key, `./assets/animation-thumbnails/${key}.png`)
        this.scene.load.start()

        image.on('filecomplete', (imgKey: string) => {
            if (imgKey === key) {
                const { width, height } = this.button
                this.createButton(imgKey, '', width - 6, height - 6)
                this.bringToTop(this.animationName)
            }
        })
    }

    public getName() {
        return this.normalizeText(this.animationNameStr)
    }
}

export default AnimationButton
