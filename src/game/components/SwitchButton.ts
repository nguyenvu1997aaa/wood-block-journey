import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class SwitchButton extends Phaser.GameObjects.Container {
    public onClick: Function

    private options: SwitchButtonOptions
    private text: Phaser.GameObjects.Image
    private panel: Phaser.GameObjects.Image
    private icon: Phaser.GameObjects.Image
    private animOn: Phaser.Tweens.Tween
    private animOff: Phaser.Tweens.Tween

    constructor(scene: Phaser.Scene, options: SwitchButtonOptions) {
        super(scene)

        this.setSize(options.width, options.height)

        this.options = options

        this.createPanel()

        this.createIcon()

        this.createText()

        this.createAnimation()

        this.updateStatus(this.options.enable)

        this.createInput()
    }

    private createInput(): void {
        this.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this.options.enable) {
                this.animOff.play()
            } else {
                this.animOn.play()
            }

            if (this.onClick) this.onClick(!this.options.enable)
        })
    }

    private createPanel(): void {
        this.panel = this.scene.make.image({
            key: KEY,
            frame: FRAME.BUTTON_TOGGLE_ON,
        })

        this.panel.setWorldSize(this.width, this.height)

        this.add(this.panel)

        Phaser.Display.Align.In.Center(this.panel, this)
    }

    private createIcon(): void {
        this.icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.BUTTON_CIRCLE,
        })

        this.icon.setWorldSize(27, 27)

        this.add(this.icon)

        Phaser.Display.Align.In.LeftCenter(this.icon, this)
    }

    private createText(): void {
        const imageScale = this.scene.world.getPixelRatio()

        this.text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_ON,
        })

        const { width, height } = this.text

        this.text.setWorldSize(width / imageScale, height / imageScale)

        this.add(this.text)

        Phaser.Display.Align.In.Center(this.text, this.panel, -10)
    }

    private createAnimation() {
        this.animOn = this.scene.add.tween({
            targets: this.icon,
            duration: 200,
            paused: true,
            x: {
                from: -this.panel.width / 2 + this.icon.width / 2,
                to: this.panel.width / 2 - this.icon.width / 2 - 3,
            },
            onComplete: () => {
                const imageScale = this.scene.world.getPixelRatio()

                Phaser.Display.Align.In.Center(this.text, this.panel, -10)

                this.text.setFrame(FRAME.TEXT_ON)

                const { width, height } = this.text

                this.text.setWorldSize(width / imageScale, height / imageScale)

                this.panel.setFrame(FRAME.BUTTON_TOGGLE_ON)
                this.panel.setWorldSize(this.width, this.height)

                this.options.enable = true
            },
        })

        const locale = this.scene.facebook.getLocale()

        this.animOff = this.scene.add.tween({
            targets: this.icon,
            duration: 200,
            paused: true,
            x: {
                from: this.panel.width / 2 - this.icon.width / 2,
                to: -this.panel.width / 2 + this.icon.width / 2,
            },
            onComplete: () => {
                const imageScale = this.scene.world.getPixelRatio()

                this.text.setFrame(FRAME.TEXT_OFF)

                const { width, height } = this.text

                this.text.setWorldSize(width / imageScale, height / imageScale)

                this.panel.setFrame(FRAME.BUTTON_TOGGLE_OFF)
                this.panel.setWorldSize(this.width, this.height)

                this.options.enable = false
                let offsetY = 0

                if (locale == 'it') offsetY = 3
                if (locale == 'pt') offsetY = 5

                Phaser.Display.Align.In.RightCenter(this.text, this.panel, -11 + offsetY)
            },
        })
    }

    public updateStatus(enable: boolean): void {
        this.options.enable = enable

        if (enable) {
            this.animOn.play()
        } else {
            this.animOff.play()
        }
    }
}

export default SwitchButton
