import { AnalyticsEvents } from '@/constants/Analytics'
import FONTS from '@/game/constants/resources/fonts'
import SOUND_EFFECT from '@/game/constants/soundEffects'

interface IFrames {
    background: string
    icon: string
    button?: string
}

class ValueBar extends Phaser.GameObjects.Container {
    protected maxValue: number

    private key: string
    private frames: IFrames

    protected bar: Phaser.GameObjects.Image
    protected icon: Phaser.GameObjects.Image
    protected button?: Phaser.GameObjects.Image
    protected value: Phaser.GameObjects.BitmapText

    constructor(scene: Phaser.Scene, key: string, frames: IFrames) {
        super(scene)

        this.key = key
        this.frames = frames

        this.maxValue = 10000

        this.createBar()
        this.createValue()
        this.createIcon()
        this.createButton()

        this.alignObject()

        this.scene.add.existing(this)
    }

    public set onClick(callback: Function) {
        if (!this.scene.ads.enabled) return

        this.setInteractive({
            useHandCursor: true,
        })

        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.logButtonEvent()
            callback()
            this.scene.audio.playSound(SOUND_EFFECT.BUTTON_CLICK)
        })
    }

    public setValue(value: number): void {
        let correctValue = `${value}`

        if (value >= this.maxValue) {
            correctValue = `${Math.floor(value / 1000)}k`
        }

        this.value.setText(correctValue)
    }

    protected alignObject() {
        const { width, height } = this.bar
        this.setSize(width, height)

        Phaser.Display.Align.In.Center(this.value, this.bar, 2, -2)
        Phaser.Display.Align.In.LeftCenter(this.icon, this.bar)

        if (this.button) {
            Phaser.Display.Align.In.RightCenter(this.button, this.bar)
        }
    }

    private createBar(): void {
        this.bar = this.scene.add.image(0, 0, this.key, this.frames.background)

        this.bar.setY(4)

        this.add(this.bar)
    }

    private createValue(): void {
        this.value = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(35),
            origin: { x: 0.5, y: 0.5 },
        })

        this.setValue(0)

        this.add(this.value)
    }

    private createIcon(): void {
        this.icon = this.scene.add.image(0, 0, this.key, this.frames.icon)

        this.add(this.icon)
    }

    private createButton(): void {
        if (!this.frames.button || !this.scene.ads.enabled) return

        this.button = this.scene.add.image(0, 0, this.key, this.frames.button)

        this.add(this.button)
    }

    protected logButtonEvent(): void {
        const parentName = this.getParentName()
        const buttonName = this.name
        this.scene.analytics.event(AnalyticsEvents.BUTTON_CLICK, {
            button_name: buttonName,
            screen_name: parentName,
        })
    }

    protected getParentName(): string {
        let parent = this.parentContainer
        while (parent) {
            if (parent instanceof GameCore.Screen) {
                const screen = parent as GameCore.Screen
                return screen.getScreenName()
            }
            parent = parent.parentContainer
        }

        return this.scene.getSceneName()
    }
}

export default ValueBar
