import { AnalyticsEvents } from '@/constants/Analytics'
import SPRITES from '@/game/constants/resources/sprites'
import Button from './Button'

const { KEY } = SPRITES.DEFAULT

class ToggleButton extends Button {
    public options: ToggleButtonOptions

    public icon: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene, options: ToggleButtonOptions) {
        super(scene, KEY, options.backgroundOn)

        this.options = options

        this.createIcon()
    }

    protected processCallback(callback: Function): void {
        const { enable } = this.options
        this.updateStatus(!enable)
        callback(!enable)
    }

    public updateStatus(enable: boolean): void {
        this.options.enable = enable

        // set icon
        const frame = this.getFrameByStatus()
        this.icon.setFrame(frame)

        // set background
        const bgFrame = this.getBackgroundByStatus()
        this.button.setFrame(bgFrame)
    }

    private getFrameByStatus = (): string => {
        const { enable, frameOn, frameOff } = this.options
        return enable ? frameOn : frameOff
    }

    private getBackgroundByStatus = (): string => {
        const { enable, backgroundOn, backgroundOff } = this.options
        return enable ? backgroundOn : backgroundOff
    }

    protected createButton = (key: string): void => {
        const bgFrame = this.getBackgroundByStatus()

        this.button = this.scene.add.image(0, 0, key, bgFrame)
        this.add(this.button)
    }

    private createIcon(): void {
        const frame = this.getFrameByStatus()

        this.icon = this.scene.make.image({
            key: KEY,
            frame,
        })

        this.add(this.icon)

        Phaser.Display.Align.In.Center(this.icon, this.button)
    }

    protected logButtonEvent(): void {
        const parentName = this.getParentName()
        const buttonName = this.name
        const enable = this.options.enable ? false : true
        this.scene.analytics.event(AnalyticsEvents.BUTTON_CLICK, {
            button_name: buttonName,
            screen_name: parentName,
            enable,
        })
    }
}

export default ToggleButton
