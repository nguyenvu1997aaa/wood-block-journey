import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import SOUND_EFFECT from '@/game/constants/soundEffects'
import LevelScene from '..'
import { StatusLevel } from '../constant/status-level'

const { KEY, FRAME } = SPRITES.DEFAULT

export interface ILevelItem {
    level: number
    status: string
}

export default class LevelItem extends Phaser.GameObjects.Container {
    public scene: LevelScene
    public levelBackground: Phaser.GameObjects.Image
    private tick: Phaser.GameObjects.Image
    private levelNumber: Phaser.GameObjects.BitmapText
    private level: number
    private tweenClick: Phaser.Tweens.Tween

    public payload: NoOptionals<ILevelItem>

    constructor(scene: LevelScene, payload?: ILevelItem) {
        super(scene)

        this.scene = scene

        this.init()

        if (payload) {
            this.updateInfo(payload)
        }

        this.scene.add.existing(this)
    }

    private init(): void {
        this.createLevelBackground()
        this.createImageCheck()
        this.createText()
        this.updateSize()
        this.alignLevelItem()

        this.setInteractive()
        this.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.audio.playSound(SOUND_EFFECT.BUTTON_CLICK)

            if (this.tweenClick) {
                this.tweenClick.play()
                return
            }

            this.scene.handlePlay()
        })
    }

    private createLevelBackground(): void {
        this.levelBackground = this.scene.make.image({
            key: KEY,
            frame: FRAME.LEVEL_PLAYING,
        })

        this.levelBackground.setWorldSize(75, 60)

        this.levelBackground.setVisible(false)

        this.add(this.levelBackground)
    }

    private updateSize(): void {
        const { width, height } = this.levelBackground
        this.setSize(width, height)
    }

    private createImageCheck(): void {
        this.tick = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_CHECK,
        })
        this.tick.setWorldSize(30, 23)
        this.tick.setVisible(false)
        this.add(this.tick)
    }

    private createText(): void {
        this.levelNumber = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(40),
            text: `${this.level}`,
            origin: { x: 0.2, y: 0.5 },
        })

        this.levelNumber.setAlpha(0.7)

        this.levelNumber.setTint(0x773a27)

        this.add(this.levelNumber)
    }

    public getLevel(): number {
        return this.level
    }

    public updateInfoLevel() {
        this.disableInteractive()

        switch (this.payload.status) {
            case StatusLevel.PASSED:
                this.levelNumber.setAlpha(0.7)
                this.levelBackground.setFrame(FRAME.LEVEL_PLAYED)
                this.tick.setVisible(true)
                break
            case StatusLevel.READY:
                this.levelNumber.setAlpha(0.7)
                this.setInteractive()
                this.createTweenClick()
                this.levelBackground.setFrame(FRAME.LEVEL_PLAYING)
                this.tick.setVisible(false)
                break
            case StatusLevel.WAITING:
                this.levelNumber.setAlpha(0.5)
                this.levelBackground.setFrame(FRAME.LEVEL_LOCKED)
                this.tick.setVisible(false)
                break
        }
    }

    public updateInfo(payload: ILevelItem) {
        this.payload = {
            ...payload,
        }
        this.updateInfoLevel()
        this.updateText()
        this.updateBackground()
        this.alignLevelItem()
    }

    private createTweenClick(): void {
        const scale = this.scale

        this.tweenClick = this.scene.tweens.add({
            targets: [this],
            duration: 100,
            paused: true,
            yoyo: true,
            scale: {
                from: scale,
                to: scale - 0.1,
            },
            onComplete: () => {
                this.scene.handlePlay()
            },
        })
    }

    private updateBackground(): void {
        this.levelBackground.setVisible(true)
    }

    public updateText(): void {
        this.levelNumber.setText(`${this.payload.level}`)
        Phaser.Display.Align.In.Center(this.levelNumber, this.levelBackground, 0, 0)
    }

    private alignLevelItem(): void {
        Phaser.Display.Align.In.Center(this.tick, this.levelBackground, 25, 10)
        Phaser.Display.Align.In.Center(this.levelNumber, this.levelBackground, 0, 0)
    }

    public setStatus(status: string): void {
        this.payload.status = status
    }

    public setTextLevel(level: number): void {
        this.payload.level = level
    }
}
