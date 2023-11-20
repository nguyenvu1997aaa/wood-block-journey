import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import GameScene from '..'

const { KEY, FRAME } = SPRITES.DEFAULT

export default class StreakBreak {
    public scene: GameScene

    private x: number
    private y: number
    private background: Phaser.GameObjects.Image
    private text: Phaser.GameObjects.BitmapText
    private tweenStep1: Phaser.Tweens.Tween
    private tweenStep2: Phaser.Tweens.Tween
    private tweenStep3: Phaser.Tweens.Tween
    private tweenStep4: Phaser.Tweens.Tween
    private tweenStep5: Phaser.Tweens.Tween
    private tweenStep6: Phaser.Tweens.Tween

    private tweenTextStep1: Phaser.Tweens.Tween
    private tweenTextStep2: Phaser.Tweens.Tween
    private tweenTextStep5: Phaser.Tweens.Tween
    private tweenTextStep6: Phaser.Tweens.Tween

    private widthText: number

    constructor(scene: GameScene) {
        this.scene = scene

        this.init()
    }

    private init(): void {
        this.createBackground()
        this.createText()
        this.createTween()

        // this.scene.input.on('pointerdown', () => {
        //     this.playAnim(200, 200)
        // })
    }

    private createBackground(): void {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.BG_STREAK,
        })

        this.background.setWorldSize(106, 38)

        this.background.setVisible(false)

        // this.add(this.background)
    }

    private createText(): void {
        this.text = this.scene.make.bitmapText({
            font: FONTS.PRIMARY_LIGHT.KEY,
            size: this.scene.fontSize(50),
            origin: { x: 0.5, y: 0.5 },
            text: `3X ${this.scene.lang.Text.STREAK}!`,
        })

        this.text.setVisible(false)

        // this.add(this.text)
    }

    private createTween(): void {
        const textScale = 1.3
        const bgScale = this.background.scale + 0.3

        this.tweenStep1 = this.scene.tweens.add({
            targets: [this.background],
            duration: 100,
            ease: Phaser.Math.Easing.Sine.InOut,
            props: {
                scale: {
                    start: 0,
                    from: 0,
                    to: bgScale,
                },
            },
            paused: true,
            onComplete: () => {
                this.tweenStep2.play()
            },
        })

        this.tweenTextStep1 = this.scene.tweens.add({
            targets: [this.text],
            duration: 200,
            ease: Phaser.Math.Easing.Sine.InOut,
            props: {
                scale: {
                    start: 0.3,
                    from: 0.3,
                    to: 1.4,
                },
            },
            paused: true,
            onComplete: () => {
                this.tweenTextStep2.play()
            },
        })

        this.tweenStep2 = this.scene.tweens.add({
            targets: [this.background],
            // delay: 100,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.InOut,
            props: {
                scale: {
                    from: bgScale,
                    to: bgScale - 0.3,
                },
            },
            paused: true,
            onComplete: () => {
                this.tweenStep3.play()
            },
        })

        this.tweenTextStep2 = this.scene.tweens.add({
            targets: [this.text],
            // delay: 100,
            duration: 100,
            ease: Phaser.Math.Easing.Sine.InOut,
            props: {
                scale: {
                    from: 1.4,
                    to: 1,
                },
            },
            paused: true,
            onComplete: () => {
                this.tweenTextStep5.play()
            },
        })

        this.tweenStep3 = this.scene.tweens.addCounter({
            from: 0,
            to: 20,
            paused: true,
            // delay: 300,
            duration: 533,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween) => {
                const value = tween.getValue()

                this.text.setPosition(this.x, this.y - value)
                this.background.setPosition(this.x, this.y - value)
            },
            onComplete: () => {
                this.y = this.y - 20
                this.tweenStep4.play()
            },
        })

        this.tweenStep4 = this.scene.tweens.addCounter({
            from: 0,
            to: 5,
            paused: true,
            // delay: 833,
            duration: 333,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween) => {
                const value = tween.getValue()

                this.text.setPosition(this.x, this.y + value)
                this.background.setPosition(this.x, this.y + value)
            },
            onComplete: () => {
                this.y = this.y + 5
                this.tweenStep5.play()
                this.tweenTextStep5.play()
            },
        })

        this.tweenStep5 = this.scene.tweens.add({
            targets: [this.background],
            delay: 567, //1733,
            duration: 67,
            ease: Phaser.Math.Easing.Sine.InOut,
            props: {
                scale: {
                    from: bgScale - 0.3,
                    to: bgScale,
                },
            },
            paused: true,
            onComplete: () => {
                this.tweenStep6.play()
            },
        })

        this.tweenTextStep5 = this.scene.tweens.add({
            targets: [this.text],
            delay: 467, //1733,
            duration: 133,
            ease: Phaser.Math.Easing.Sine.InOut,
            props: {
                scale: {
                    from: 1,
                    to: 0.8,
                },
            },
            paused: true,
            onComplete: () => {
                this.tweenTextStep6.play()
            },
        })

        this.tweenStep6 = this.scene.tweens.add({
            targets: [this.background],
            // delay: 1800,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.InOut,
            props: {
                scale: {
                    from: bgScale,
                    to: 0,
                },
            },
            paused: true,
            onComplete: () => {
                this.text.setVisible(false)
                this.background.setVisible(false)
                this.text.setScale(0)
                this.background.setScale(0)
            },
        })

        this.tweenTextStep6 = this.scene.tweens.add({
            targets: [this.text],
            // delay: 1800,
            duration: 167,
            ease: Phaser.Math.Easing.Sine.InOut,
            props: {
                scale: {
                    from: 0.8,
                    to: 1.7,
                },
                alpha: {
                    from: 1,
                    to: 0,
                },
            },
            paused: true,
            onComplete: () => {
                this.text.setVisible(false)
                this.text.setScale(0)
            },
        })
    }

    public playAnim(x: number, y: number): void {
        if (
            this.tweenTextStep1.isPlaying() ||
            this.tweenTextStep2.isPlaying() ||
            this.tweenTextStep5.isPlaying() ||
            this.tweenTextStep6.isPlaying()
        ) {
            this.tweenTextStep1.stop()
            this.tweenTextStep2.stop()
            this.tweenTextStep5.stop()
            this.tweenTextStep6.stop()

            this.text.setScale(0)
            this.text.setVisible(false)

            this.background.setScale(0)
            this.background.setVisible(false)
        }

        this.x = x
        this.y = y

        this.text.setScale(0).setAlpha(1)
        this.background.setScale(0)

        let positionX = x
        const { width: widthScene } = this.scene.gameZone
        if (x - this.widthText / 2 < 0) {
            positionX = this.widthText / 2 + 5
        } else if (x + this.widthText / 2 > widthScene) {
            positionX = widthScene - this.widthText / 2 - 5
        } else {
            positionX = x
        }
        this.text.setPosition(positionX, y)
        this.background.setPosition(positionX, y)

        this.text.setVisible(true)
        // this.background.setVisible(true)

        // this.tweenStep1.play()
        this.tweenTextStep1.play()
    }

    public setTextCombo(amountCombo: number) {
        this.text.setText(`${amountCombo}X  ${this.scene.lang.Text.COMBO}`)

        this.text.setScale(1)
        this.widthText = this.text.width + 50
    }

    public setTextStreak(amountStreak: number) {
        this.text.setText(`${amountStreak}X  ${this.scene.lang.Text.STREAK}`)

        this.text.setScale(1)
        this.widthText = this.text.width + 50
    }

    public setBgFrame(frame: string) {
        this.background.setFrame(frame)
    }
}
