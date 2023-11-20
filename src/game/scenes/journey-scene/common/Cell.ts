import { ICell } from '@/constants/ICommon'
import SPRITES from '@/game/constants/resources/sprites'
import { xCoord, yCoord } from '@/utils/ProjectileMotion'
import { ICanCaptureCell } from '../constant/types'

const { KEY, FRAME } = SPRITES.GAMEPLAY_32

class Cell extends Phaser.GameObjects.Container {
    canCapture: ICanCaptureCell = { direction: 'bottom', angle: 0 }

    private status: string
    private rateShaking = 1

    public t0 = 0
    public x0: number
    public y0: number
    public v0: number
    public alpha0: number
    public scale0: number
    public maxScale0: number
    public scaleRate0: number
    public imageBreak: Phaser.GameObjects.Image

    private imageCell: Phaser.GameObjects.Image
    private imageGameOver: Phaser.GameObjects.Image
    private imageGameStart: Phaser.GameObjects.Image
    private imageHighlight: Phaser.GameObjects.Image

    private tweenImageGameOver: Phaser.Tweens.Tween
    private tweenImageHighlight: Phaser.Tweens.Tween
    private tweenScaleDown: Phaser.Tweens.Tween
    private tweenAlphaImageBreak: Phaser.Tweens.Tween
    private tweenStartMission: Phaser.Tweens.Tween

    constructor(scene: Phaser.Scene, props: ICell) {
        super(scene, props.x + (props.padding || 0), props.y + (props.padding || 0))

        this.setSize(props.width, props.height)

        this.x0 = props.x + (props.padding || 0)
        this.y0 = props.y + (props.padding || 0)

        this.createImageCell()
        this.createImageGameStart()
        this.createImageBreak()
        this.createImageGameOver()
        this.createImageHighlight()

        this.createTweenImageGameOver()
        this.createTweenImageGHighlight()
        this.createTweenScaleDown()
        this.createTweenAlphaImageBreak()
        this.createTweenStartMission()

        scene.add.existing(this)
    }

    private createImageCell() {
        this.imageCell = this.scene.make.image({
            key: KEY,
            frame: FRAME.GEM_TRANSPARENT,
        })

        this.imageCell.setWorldSize(this.width, this.height)

        this.add(this.imageCell)

        this.scale0 = this.imageCell.scale
    }

    private createImageBreak() {
        this.imageBreak = this.scene.make.image({
            key: KEY,
            frame: FRAME.GEM_WHITE,
        })

        this.imageBreak.setVisible(false)
        this.imageBreak.setWorldSize(this.width, this.height)

        this.add(this.imageBreak)
    }

    private createImageGameStart() {
        this.imageGameStart = this.scene.make.image({
            key: KEY,
            frame: FRAME.GEM_GLARE,
        })

        this.imageGameStart.setVisible(false)
        this.imageGameStart.setWorldSize(this.width, this.height)

        this.add(this.imageGameStart)
    }

    private createImageGameOver() {
        this.imageGameOver = this.scene.make.image({
            key: KEY,
            frame: FRAME.GEM_SILVER,
        })

        this.imageGameOver.setVisible(false)
        this.imageGameOver.setWorldSize(this.width, this.height)

        this.add(this.imageGameOver)
    }

    private createTweenImageGameOver(): void {
        this.tweenImageGameOver = this.scene.add.tween({
            targets: [this.imageGameOver],
            duration: 1200,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            alpha: {
                from: 0,
                to: 1,
                start: 0,
            },
            paused: true,
        })
    }

    private createImageHighlight(): void {
        this.imageHighlight = this.scene.make.image({
            key: KEY,
            frame: FRAME.GEM_LIGHT,
        })

        this.imageHighlight.setVisible(false)
        this.imageHighlight.setWorldSize(this.width, this.height)

        this.add(this.imageHighlight)
    }

    private createTweenImageGHighlight(): void {
        this.tweenImageHighlight = this.scene.add.tween({
            targets: [this.imageHighlight],
            duration: 100,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            alpha: {
                from: 0,
                to: 1,
                start: 0,
            },
            paused: true,
        })
    }

    private createTweenStartMission(): void {
        this.tweenStartMission = this.scene.add.tween({
            targets: [this.imageGameStart],
            duration: 200,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            scale: {
                from: 0,
                to: this.scale0,
                start: 0,
            },
            alpha: {
                from: 0,
                to: 1,
                start: 0,
            },
            yoyo: true,
            paused: true,
        })
    }

    private createTweenScaleDown(): void {
        const { scale } = this.imageBreak

        this.tweenScaleDown = this.scene.add.tween({
            delay: 100,
            targets: [this.imageBreak],
            duration: 600,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            scale: {
                from: scale,
                to: 0,
                start: scale,
            },
            paused: true,
        })
    }

    private createTweenAlphaImageBreak(): void {
        this.tweenAlphaImageBreak = this.scene.add.tween({
            targets: [this.imageBreak],
            duration: 150,
            ease: Phaser.Math.Easing.Sine.InOut,
            alpha: {
                from: 0.2,
                to: 0.68,
            },
            paused: true,
            // yoyo: true,
        })
    }

    public showImageHighlight() {
        const frameLight = this.imageCell.frame.name + '_light'

        this.imageHighlight.setFrame(frameLight)

        this.imageHighlight.setVisible(true).setAlpha(1)

        // this.tweenImageHighlight.play()
    }

    public hideImageHighlight() {
        this.imageHighlight.setVisible(false)
    }

    public isHighlight(): boolean {
        return this.imageHighlight.visible
    }

    public isShaking(): boolean {
        return this.status === 'SHAKING'
    }

    public playAnimShaking() {
        this.status = 'SHAKING'
    }

    public playTweenBreaking() {
        this.status = 'BREAKING'
    }

    public setRateShaking(rateShaking: number) {
        this.rateShaking = rateShaking
    }

    public stopAnimShaking() {
        this.rotation = 0
        this.status = ''
    }

    public reset(): void {
        // this.x = this.x0
        // this.y = this.y0
        this.scale = 1
        this.alpha = 1
        this.imageCell.setAlpha(1)
    }

    public resetImageBreak(): void {
        this.imageBreak.rotation = 0
        this.imageBreak.scale = this.scale0
        this.imageBreak.setVisible(false)
    }

    public resetImageGameOver(): void {
        this.imageGameOver.setVisible(false)
    }

    public playAnimImageGameOver(): void {
        this.resetImageGameOver()
        this.imageGameOver.setVisible(true).setAlpha(0)
        this.tweenImageGameOver.play()
    }

    public playTweenScaleDown(): void {
        this.resetImageBreak()
        this.imageBreak.setVisible(true).setScale(this.scale0).setAlpha(0)
        this.tweenAlphaImageBreak.play()
        this.tweenScaleDown.play()
    }

    public playTweenStartMission() {
        this.imageGameStart.setVisible(true).setAlpha(0)
        this.tweenStartMission.play()
    }

    preUpdate() {
        switch (this.status) {
            case 'SHAKING':
                this.rotation += 0.015 * this.rateShaking

                if (this.rotation > 0.1) {
                    this.rateShaking = -1
                }

                if (this.rotation < -0.1) {
                    this.rateShaking = 1
                }

                break
        }
    }

    handleTweenBreaking() {
        const rateX = this.alpha0 < 90 ? 1 : -1
        this.t0 += 3000 / 1900
        const t = this.t0 * 0.016
        const pX = xCoord(this.v0, this.alpha0, t)
        const pY = yCoord(this.v0, this.alpha0, t)

        this.imageBreak.x = this.x0 + pX
        this.imageBreak.y = this.y0 - pY

        console.log('this.imageBreak.y === ', t, this.t0, this.imageBreak.y)

        this.imageBreak.rotation += 0.04 * rateX

        if (this.imageBreak.scale > 0.4) {
            this.imageBreak.scale -= this.scale0
        } else {
            this.imageBreak.scale = 0.4
        }

        const { width, height } = this.scene.gameZone

        if (this.imageBreak.x - this.imageBreak.displayWidth / 2 < 0) {
            this.status = ''
            return
        }

        if (this.imageBreak.x + this.imageBreak.displayWidth / 2 > width) {
            this.status = ''
            return
        }

        if (this.imageBreak.y - this.imageBreak.displayHeight / 2 > height) {
            this.status = ''
            return
        }
    }

    public setFrameImageCell(frame: string): void {
        this.imageCell.setFrame(frame)
    }

    public setAlphaImageCell(alpha: number): void {
        this.imageCell.setAlpha(alpha)
    }

    public setScaleImageCell(scale: number): void {
        this.imageCell.setScale(scale)
    }

    public getFrameImageCell(): string {
        return this.imageCell.frame.name
    }
}

export default Cell
