import { AnalyticsEvents } from '@/constants/Analytics'
import ScaleDownAnimation from '@/game/animations/basic/ScaleDown'
import ScaleUpAnimation from '@/game/animations/basic/ScaleUp'
import DEPTH_OBJECTS from '@/game/constants/depth'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import { addBreadcrumbSentry } from '@/utils/Sentry'

class Button extends Phaser.GameObjects.Container {
    public useSound = true
    private isClicked = false

    private scaleUp = -1
    private scaleDown = -1

    public button: Phaser.GameObjects.Image

    protected upAnimation: ScaleUpAnimation
    protected downAnimation: ScaleDownAnimation

    private isUsePixelPerfect = false
    private hitArea: Phaser.GameObjects.Zone | Phaser.GameObjects.Image
    protected hitZone: Phaser.GameObjects.Zone

    protected scaleDownPress: number

    private parentName: string

    constructor(
        scene: Phaser.Scene,
        key: string,
        frame: string,
        width?: number,
        height?: number,
        usePixelPerfect = false
    ) {
        super(scene)

        this.isUsePixelPerfect = usePixelPerfect

        this.setDepth(DEPTH_OBJECTS.BUTTON)

        this.createButton(key, frame, width, height)

        this.updateSize()

        this.listenEvents()

        this.scene.add.existing(this)
    }

    private listenEvents() {
        this.scene.events.on(Phaser.Scenes.Events.SLEEP, this.handleSceneSleep)
        this.once(Phaser.GameObjects.Events.DESTROY, this.handelObjectDestroy)
    }

    private handelObjectDestroy = (): void => {
        if (!this.scene) return
        this.scene.events.off(Phaser.Scenes.Events.SLEEP, this.handleSceneSleep)
    }

    private handleSceneSleep = () => {
        if (!this.scene) return
        this.scene.tweens.killTweensOf(this)
    }

    public set onClick(callback: Function) {
        if (this.isUsePixelPerfect) {
            this.hitArea = this.button

            this.hitArea.setInteractive({
                useHandCursor: true,
                pixelPerfect: true,
            })
        } else {
            this.hitArea = this.hitZone

            this.updateSize()

            this.hitArea.setInteractive({
                useHandCursor: true,
            })
        }

        this.hitArea.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handlePointerDown)
        this.hitArea.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleOnClick(callback))
        this.hitArea.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.handlePointerOut)
    }

    public get isUsePixelPerFect() {
        return this.isUsePixelPerfect
    }

    private handlePointerDown = () => {
        if (this.isClicked) return
        if (this.upAnimation?.tween?.isPlaying()) return

        this.isClicked = true
        this.runDownAnimation()
    }

    private handleOnClick = (callback: Function) => (): void => {
        if (!this.isClicked) return
        if (this.upAnimation?.tween?.isPlaying()) return

        this.isClicked = false

        this.runUpAnimation()
        this.upAnimation?.tween?.once(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
            this.logButtonEvent()
            this.addDebugData()
            this.processCallback(callback)
        })
    }

    private handlePointerOut = () => {
        if (!this.isClicked) return
        if (this.upAnimation?.tween?.isPlaying()) return

        this.isClicked = false

        this.runUpAnimation()
    }

    protected processCallback(callback: Function): void {
        this.upAnimation?.stop()
        this.downAnimation?.stop()
        this.scene?.tweens.killTweensOf(this)

        if (this.scaleUp !== -1) {
            this.setScale(this.scaleUp)
        }

        callback()
    }

    public setDisabled(disable: boolean): void {
        if (disable) {
            this.setAlpha(0.5)
            this.hitArea?.disableInteractive()
        } else {
            this.setAlpha(1)
            this.hitArea?.setInteractive()
        }
    }

    protected createButton(key: string, frame: string, width?: number, height?: number): void {
        this.button = this.scene.add.image(0, 0, key, frame)

        if (width && height) {
            this.button.setWorldSize(width, height)
        }

        this.scaleDownPress = this.scale - 0.1

        const { displayWidth, displayHeight } = this.button

        this.hitZone = this.scene.make.zone({
            displayWidth,
            displayHeight,
        })

        this.add([this.button, this.hitZone])
    }

    // This method can be change on child classes for specific buttons
    protected updateSize(): void {
        const { width, height } = this.button

        const padMax = 10
        const padWidth = (width / 100) * 10
        const padHeight = (height / 100) * 10

        const bounceWidth = padWidth < padMax ? padWidth : padMax
        const bounceHeight = padHeight < padMax ? padHeight : padMax

        this.setSize(width + bounceWidth, height + bounceHeight)
        this.hitZone.setSize(width + bounceWidth, height + bounceHeight)
    }

    private runDownAnimation = (): void => {
        if (this.scaleDown === -1) {
            this.scaleUp = this.scale
            this.scaleDown = this.scaleDownPress
        }

        if (this.useSound) {
            this.scene.audio.playSound(SOUND_EFFECT.BUTTON_CLICK)
        }

        this.downAnimation?.remove()

        this.downAnimation = new ScaleDownAnimation({
            targets: [this],
            duration: 150,
            props: {
                scale: this.scaleDown,
            },
            onUpdate: () => {
                this.hitZone.scale = 1 / this.scale
            },
        })

        this.downAnimation.play()
    }

    private runUpAnimation = (): void => {
        if (this.scaleUp === -1) return

        this.upAnimation?.remove()
        this.upAnimation = new ScaleDownAnimation({
            targets: [this],
            duration: 150,
            props: {
                scale: this.scaleUp,
            },
            onUpdate: () => {
                this.hitZone.scale = 1 / this.scale
            },
        })

        this.upAnimation.play()
    }

    protected addDebugData(): void {
        const parentName = this.getParentName()
        const buttonName = this.name

        // ? Debug data for Sentry
        addBreadcrumbSentry('ui-click', `${parentName}:${buttonName}`)
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
        if (this.parentName) return this.parentName

        let parent = this.parentContainer
        while (parent) {
            if (parent instanceof GameCore.Screen) {
                const screen = parent as GameCore.Screen
                this.parentName = screen.getScreenName()
                return this.parentName
            }

            parent = parent.parentContainer
        }

        this.parentName = this.scene.getSceneName()
        return this.parentName
    }
}

export default Button
